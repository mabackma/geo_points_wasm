import init, { geo_json_from_coords, SharedBuffer } from './pkg/geo_points_wasm.js';

async function handleFile(file) {
    const reader = new FileReader();

    reader.onload = async function (event) {
        const xmlContent = event.target.result;

        // Initialize the WebAssembly module
        await init();

        try {
            // Start timing
            const start = performance.now();

            // Example coordinates for the bounding box
            const min_x = 25.347136232586948;
            const max_x = 25.42651387476916;
            const min_y = 66.42980392068148;
            const max_y = 66.46850960846054;

            // Call the WebAssembly function with the XML content
            const result = await geo_json_from_coords(min_x, max_x, min_y, max_y, xmlContent);
            const geojson = result.geojson;
            const treeCount = result.tree_count;

            // Create buffer for the tree data
            const buffer = new SharedBuffer(treeCount);

            const trees = buffer.read_trees();
            
            // End timing
            const end = performance.now();
            const duration = end - start;
            console.log(`Time elapsed: ${duration} ms`);
            
            // Log the GeoJSON and tree data
            console.log('GeoJson:', geojson);
            trees.forEach(tree => {
                console.log(`Tree: x=${tree.x}, y=${tree.y}, species=${tree.species}`);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    reader.readAsText(file);
}

document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        handleFile(file);
    }
});
