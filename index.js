import init, { fetch_buildings, fetch_buildings_as_polygons, fetch_roads } from './pkg/your_project_name';

async function run() {
    // Initialize the WebAssembly module
    await init();

    // Bounding box of the whole map
    const bbox = {
        type: "Polygon",
        coordinates: [
            [
                [25.347136232586948, 66.42980392068148],
                [25.42651387476916, 66.42980392068148],
                [25.42651387476916, 66.46850960846054],
                [25.347136232586948, 66.46850960846054],
                [25.347136232586948, 66.42980392068148]
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
