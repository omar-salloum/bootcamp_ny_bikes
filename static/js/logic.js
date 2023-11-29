// Step 1: Fetch data from Citi Bike station information endpoint.
function fetchStationData() {
  return fetch('https://gbfs.citibikenyc.com/gbfs/en/station_information.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => data.data.stations)
    .catch(error => console.error('Error fetching station data:', error));
}

// Step 2: Create a Leaflet map with pins for each station.
function createMap(bikeStations) {
  // Use coordinates to position a Leaflet map over New York City.
  let newYorkCoords = [40.730610, -73.935242];
  let mapZoomLevel = 12;

  // Create the tile layer that will be the background of our map.
  let myMap = L.map("map-id", {
    center: newYorkCoords,
    zoom: mapZoomLevel
  });

  // Create the tile layer with OpenStreetMap.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  // Create an overlayMaps object to hold the bikeStations layer.
  let bikeStationsLayer = L.layerGroup();

  // Add markers for bike stations to the bikeStationsLayer.
  bikeStations.forEach(station => {
    L.marker([station.lat, station.lon])
      .bindPopup(`<b>${station.name}</b><br>Capacity: ${station.capacity}`)
      .addTo(bikeStationsLayer);
  });

  // Create a layer control, and pass it baseMaps and overlayMaps.
  L.control.layers({}, { "Bike Stations": bikeStationsLayer }).addTo(myMap);
}

// Step 3: Create a function named `createMarkers` that takes `response` as an argument.
function createMarkers(response) {
  // Ensure the response object contains the expected data structure.
  if (response && response.data && response.data.stations) {
    // Extract the array of stations from the response.
    let bikeStations = response.data.stations;

    // Using the array of stations, create the map.
    createMap(bikeStations);
  } else {
    console.error('Invalid response format. Unable to retrieve station data.');
  }
}

// Step 4: Using D3, retrieve JSON data from the Citi Bike station information endpoint, and then call the `createMarkers` function.
d3.json('https://gbfs.citibikenyc.com/gbfs/en/station_information.json')
  .then(createMarkers)
  .catch(error => console.error('Error fetching station data:', error));
