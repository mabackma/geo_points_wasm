import init, { fetch_buildings, fetch_roads } from './pkg/geo_points_wasm.js';

async function run() {
    console.log("Initializing WebAssembly module...");
    // Initialize the WebAssembly module
    await init();
    console.log("WebAssembly module initialized.");

    // Bounding box coordinates
    const min_x = 25.347136232586948;
    const max_x = 25.42651387476916;
    const min_y = 66.42980392068148;
    const max_y = 66.46850960846054;

    try {
        // Fetch buildings
        console.log("Fetching buildings...");
        const buildingsGeoJson = await fetch_buildings(min_x, max_x, min_y, max_y);
        console.log("Buildings GeoJson:", buildingsGeoJson);

        // Fetch roads
        console.log("Fetching roads...");
        const roadsGeoJson = await fetch_roads(min_x, max_x, min_y, max_y);
        console.log("Roads GeoJson:", roadsGeoJson);
    } catch (error) {
        console.error("Error:", error);
    }
}

run();
