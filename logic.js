// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    console.log(data)
    cr_Features(data.features);
  });
  
  // Function to create features using the earthquake data.
  function cr_Features(earthquakeData) {
  
     function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
          radius: markerSize(feature.properties.mag),
          fillColor: fillColor(feature.properties.mag),
          color: "black",
          weight: 0.6,
          opacity: 0.4,
          fillOpacity: 0.6
        });
        },
  
        onEachFeature: function (feature, layer) {
          return layer.bindPopup(`<strong>Place:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${feature.properties.mag}`);
        }
      });
  
      createMap(earthquakes);
  }
  
  
  function createMap(earthquakes) {
  
    
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    
    var myMap = L.map("map", {
      center: [
        40.22, -74.75
      ],
      zoom: 3,
      layers: [streetmap, earthquakes]
    });
  

    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
  
  // Set up the legend and the colour variance for magnitude from leaflet documentation
  var legend = L.control({ position: 'bottomright'});
  
  
    legend.onAdd = function() {
      var div = L.DomUtil.create('div', 'info legend'),
          magnitude = [0,1,2,3,4,5,6],
          labels = [];
  
    
      for (var i = 0; i < magnitude.length; i++) {
          div.innerHTML +=
              '<i style="background:' + fillColor(magnitude[i] + 1) + '"></i> ' +
              magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
      console.log(i,div.innerHTML);
            }
  
  
      return div;
  };
  
  legend.addTo(myMap);
    };

  function fillColor(magnituge) {
  
      switch (true) {
        case magnituge >= 6.0:
          return 'red';
          break;
        
        case magnituge >= 5.0:
          return 'orangered';
          break;
  
        case magnituge >= 4.0:
          return 'darkorange';
          break;
        
        case magnituge >= 3.0:
          return 'orange';
          break;
  
        case magnituge >= 2.0:
          return 'gold';
          break;
  
        case magnituge >= 1.0:
          return 'yellow';
          break;
  
        default:
          return 'greenyellow';
      };
  };
  
  
  
  function markerSize(magnituge) {
    return magnituge*3;
  }
  