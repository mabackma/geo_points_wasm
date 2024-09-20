import init, { geo_json_from_coords, SharedBuffer } from './pkg/geo_points_wasm.js';

async function handleFile(file) {
    const reader = new FileReader();

    reader.onload = async function (event) {
        const xmlContent = event.target.result;

        // Initialize the WebAssembly module
        const wasm = await init();
        const memory = wasm.memory

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

            // Create a new SharedBuffer to store tree data
            const buffer = new SharedBuffer(treeCount);

            // Access the raw memory buffer directly using Float64Array
            const wasmMemory = new Float64Array(memory.buffer, buffer.ptr(), buffer.len());

            // End timing
            const end = performance.now();
            const duration = end - start;
            console.log(`Time elapsed: ${duration} ms`);
            
            // Log the GeoJSON and tree data
            console.log('GeoJson:', geojson);
            console.log('Tree count:', treeCount);
            for (let i = 0; i < wasmMemory.length; i += 3) {
                console.log(`Tree: x=${wasmMemory[i]}, y=${wasmMemory[i + 1]}, species=${wasmMemory[i + 2]}`);
            }
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
