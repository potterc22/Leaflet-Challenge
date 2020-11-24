// chose to do Earthquakes from the past 7 days
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function getColor(data) {
    return data > 90 ? 'red' :
        data >= 70 ? '#e67300' :
        data >= 50 ? 'orange' :
        data >= 30 ? '#ffcc00' :
        data >= 10 ? '#ccff66' :
        '#66ff33';
}

// Function to determine marker size based on population
function markerSize(magnitude) {
      return magnitude * 10000;
}

// Grab the data with d3
d3.json(queryURL, function(response) {

    // create variable to hold latitude and longitude values
    var earthquakes = []

    // Loop through data
    for (var i = 0; i < response.features.length; i++) {
        
        // Set the data location property to a variable
        var location = response.features[i].geometry;

        earthquakes.push(
            L.circle(location.coordinates, {
                stroke: false,
                fillOpacity: 0.75,
                color: 'black',
                fillColor: getColor(location.coordinates[2]),
                radius: markerSize(response.features[i].properties.mag)
            }).bindPopup("<h2>" + response.features[i].properties.place + 
            "</h2> <h3> Magnitude: " + response.features[i].properties.mag + "</h3>")
        )
        console.log(markerSize(response.features[i].properties.mag))
    }
    
    console.log(earthquakes)
    // Adding light layer variable
    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });

    // Adding satellite layer variable
    var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });

    // Adding outdoors layer variable
    var outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    });    

    // Create a separate layer group for earthquakes below. 
    var earthquakeLayer = L.layerGroup(earthquakes)
    console.log(earthquakeLayer)
    // Create a baseMaps object to contain the streetmap and darkmap
    var baseMaps = {
        Grayscale: lightMap,
        Satellite: satelliteMap,
        Outdoors: outdoorMap
    }

    var overlayMaps = {
        EarthquakeLayer: earthquakeLayer
    }

    // Creating map object
    var myMap = L.map("map", {
        center: [28,2],
        zoom: 2,
        layers: [lightMap, earthquakeLayer]
    });

    // Create a layer control, containing our baseMaps and overlayMaps, and add them to the map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap)
});