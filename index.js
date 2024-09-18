import init, { fetch_buildings, fetch_buildings_as_polygons, fetch_roads } from './pkg/your_project_name';

async function run() {
    // Initialize the WebAssembly module
    await init();

    // Define a bounding box as a Polygon (example coordinates)
    const bbox = {
        type: "Polygon",
        coordinates: [
            [
                [0, 0],
                [10, 0],
                [10, 10],
                [0, 10],
                [0, 0]
            ]
        ]
    };

    try {
        // Fetch buildings
        const buildingsGeoJson = await fetch_buildings(bbox);
        console.log("Buildings GeoJson:", buildingsGeoJson);

        // Convert GeoJson to polygons
        const buildingsPolygons = await fetch_buildings_as_polygons(buildingsGeoJson);
        console.log("Buildings Polygons:", buildingsPolygons);

        // Fetch roads
        const roadsGeoJson = await fetch_roads(bbox);
        console.log("Roads GeoJson:", roadsGeoJson);
    } catch (error) {
        console.error("Error:", error);
    }
}

run();
