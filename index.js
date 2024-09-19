import init, { geo_json_from_coords } from './pkg/geo_points_wasm.js';

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

            // End timing
            const end = performance.now();
            const duration = end - start;
            console.log(`Time elapsed: ${duration} ms`);
            
            console.log('GeoJson:', result);
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
