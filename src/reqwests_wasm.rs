use crate::geometry_utils::get_min_max_coordinates;
use geo::{LineString, Polygon};
use geojson::{GeoJson, Value};
use reqwest::Error as ReqwestError;
use geojson::Error as GeoJsonError;
use std::fmt;
use wasm_bindgen::prelude::*;
use futures::future;

#[derive(Debug)]
pub enum FetchError {
    Reqwest(ReqwestError),
    GeoJson(GeoJsonError),
}

impl fmt::Display for FetchError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            FetchError::Reqwest(err) => write!(f, "Reqwest error: {}", err),
            FetchError::GeoJson(err) => write!(f, "GeoJson error: {}", err),
        }
    }
}

impl std::error::Error for FetchError {}

impl From<ReqwestError> for FetchError {
    fn from(err: ReqwestError) -> Self {
        FetchError::Reqwest(err)
    }
}

impl From<GeoJsonError> for FetchError {
    fn from(err: GeoJsonError) -> Self {
        FetchError::GeoJson(err)
    }
}

#[wasm_bindgen]
pub async fn fetch_buildings(bbox: &Polygon<f64>) -> Result<GeoJson, FetchError> {
    let (min_x, max_x, min_y, max_y) = get_min_max_coordinates(&bbox);

    let west = min_x;
    let south = min_y;
    let east = max_x;
    let north = max_y;

    let url = format!(
        "https://metne-test.onrender.com/geoserver/mml/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=mml:rakennus&maxFeatures=2000&outputFormat=application%2Fjson&BBOX={},{},{},{},EPSG:4326&srsName=EPSG:4326",
        west, south, east, north
    );

    let resp = reqwest::get(&url).await?.text().await?;
    let geojson = resp.parse::<GeoJson>()?;

    Ok(geojson)
}

#[wasm_bindgen]
pub async fn fetch_buildings_as_polygons(geojson: &GeoJson) -> Result<Vec<Polygon<f64>>, Box<dyn std::error::Error>> {
    let mut polygons = Vec::new();

    if let GeoJson::FeatureCollection(collection) = geojson {
        for feature in &collection.features {
            if let Some(geometry) = &feature.geometry {
                match &geometry.value {
                    Value::Polygon(polygon) => {
                        let exterior = polygon[0]
                            .iter()
                            .map(|point| (point[0], point[1]))
                            .collect::<Vec<_>>();
                        
                        let poly = Polygon::new(LineString::from(exterior), vec![]);
                        polygons.push(poly);
                    }
                    _ => {
                        eprintln!("Skipping non-polygon geometry");
                    }
                }
            }
        }
    } else {
        return Err("GeoJson is not a FeatureCollection.".into());
    }

    Ok(polygons)
}

#[wasm_bindgen]
pub async fn fetch_roads(bbox: &Polygon<f64>) -> Result<GeoJson, FetchError> {
    let (min_x, max_x, min_y, max_y) = get_min_max_coordinates(&bbox);

    let west = min_x;
    let south = min_y;
    let east = max_x;
    let north = max_y;

    let url = format!(
        "https://metne-test.onrender.com/geoserver/mml/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=mml:tieviiva&bbox={},{},{},{},EPSG:4326&srsName=EPSG:4326&outputFormat=application/json",
        west, south, east, north
    );

    let resp = reqwest::get(&url).await?.text().await?;
    let geojson = resp.parse::<GeoJson>()?;

    Ok(geojson)
}
