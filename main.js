import init, { generate_geojson_from_coords } from './pkg/geo_points_wasm.js';

async function run() {
    // Initialize the WebAssembly module
    await init();

    // Define bounding box coordinates in JavaScript
    const min_x = 34.0;
    const max_x = 35.0;
    const min_y = -118.0;
    const max_y = -117.0;

    // Call the Rust function to generate the GeoJSON
    const geojson = generate_geojson_from_coords(min_x, max_x, min_y, max_y);

    // Print the resulting GeoJSON
    console.log("Generated GeoJSON:", geojson);
}

run();
