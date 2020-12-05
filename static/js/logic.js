// I chose to do Earthquakes from the past 7 days
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
      return magnitude * 25000;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Create Base Layers


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



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Create Initial Map

// Create a baseMaps object to contain the streetmap and darkmap
var baseMaps = {
    Grayscale: lightMap,
    Satellite: satelliteMap,
    Outdoors: outdoorMap
}

// declare variable for overlay group
var layers = {
    Earthquakes: new L.layerGroup(),
    TectonicPlates: new L.LayerGroup()
};

var overlayMaps = {
    Earthquakes: layers.Earthquakes,
    TectonicPlates: layers.TectonicPlates
}

// Creating map object
var myMap = L.map("map", {
    center: [30,-40],
    zoom: 3,
    layers: [lightMap, layers.Earthquakes, layers.TectonicPlates]
});

// Create a layer control, containing our baseMaps and overlayMaps, and add them to the map
L.control.layers(baseMaps, overlayMaps).addTo(myMap)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Create Earthquakes layer

// Grab the data with d3
d3.json(queryURL, function(response) {
    // var depth = response.features[0].geometry.coordinates[2]
    // console.log(depth)
    // L.geoJson(response, {
    //     style: function(feature) {
    //         return {
    //             opacity: 1.25,
    //             fillOpacity: 0.75,
    //             color: 'black',
    //             weight: 0.4,
    //             fillColor: getColor(feature.geometry.coordinates[2]),
    //             radius: markerSize(feature.properties.mag)
    //         }
    //     },
    //     // use pointToLayer to create circles
    //     pointToLayer: function(feature, latlng) {
    //         return L.circleMarker(latlng)
    //             .bindPopup("<h2>Location: " + feature.properties.place + 
    //                 "</h2> <h3> Magnitude: " + feature.properties.mag + "</h3>")
    //     }
    // }).addTo(layers.Earthquakes)


    // Loop through data
    for (var i = 0; i < response.features.length; i++) {
        
        // Set the data location property to a variable
        var location = response.features[i].geometry;

        L.circle([location.coordinates[1], location.coordinates[0]], {
            // stroke: false,
            fillOpacity: 0.75,
            color: "black",
            weight: 1,
            fillColor: getColor(location.coordinates[2]),
            radius: markerSize(response.features[i].properties.mag)
        }).bindPopup("<h2>" + response.features[i].properties.place + 
        "</h2> <h3> Magnitude: " + response.features[i].properties.mag + "</h3>").addTo(layers.Earthquakes)
    }
    
    
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Create tectonic plates layer

platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

// Grab the tectonic plates data with d3
d3.json(platesURL, function(response) {
    L.geoJson(response, {
        style: {
            opacity: .35,
            weight: 2
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3> Tectonic Plate Name: " + feature.properties.PlateName + "</h3>")
        }
    }).addTo(layers.TectonicPlates)   
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// create the legend 
// https://leafletjs.com/examples/choropleth/
// https://github.com/timwis/leaflet-choropleth/blob/gh-pages/examples/legend/demo.js

var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend'),
        limits = [-10, 10, 30, 50, 70, 90],
        labels = [];
        
    for (var i = 0; i < limits.length; i++) {
        labels.push(
            '<div class="labels"><i style="background:' + getColor(limits[i] + 1) + '"></i>' + 
            limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+') + '</div>');
    }

    div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    return div;
}

legend.addTo(myMap)