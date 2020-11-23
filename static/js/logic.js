// Creating map object
var myMap = L.map("map", {
    center: [28,2],
    zoom: 2
});
  
// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
}).addTo(myMap);

// chose to do M4.5+ Earthquakes from the past 7 days
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"

// Grab the data with d3
d3.json(queryURL, function(response) {
    console.log(response)
    console.log(response.features[0].geometry.coordinates)

      // Loop through data
      for (var i = 0; i < response.features.length; i++) {
        
        // Set the data location property to a variable
        var location = response.features[i].geometry;
        // Check for location property
        if (location) {
          
          // Add a new marker to the cluster group and bind a pop-up
          L.marker([location.coordinates[1],location.coordinates[0]])
            .bindPopup("<h2>" + response.features[i].properties.place + 
                "</h2> <h3> Magnitude: " + 
                response.features[i].properties.mag + 
                "</h3>").addTo(myMap);
        }
      }
});