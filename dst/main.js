// map class initialize
var map = L.map("map", {
  measureControl: true,
  primaryLengthUnit: "kilometers",
  primaryAreaUnit: "sqmeters",
}).setView([0.0236, 37.9062], 6.5);
map.zoomControl.setPosition("topleft");

// Adding tile layer
var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);

var MtbMap = L.tileLayer("http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &amp; USGS',
});

//   Adding marker in the center of the map
var singleMarker = L.circleMarker([0.0236, 37.9062], {color:'red', radius:20, fillColor:'yellow'})
  // .addTo(map)
  .bindPopup("Center of<br> Kenya")
  .openPopup();

// Add map scale
L.control.scale().addTo(map);

//   Full Screen map View
var mapId = document.getElementById("map");
function fullScreenView() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    mapId.requestFullscreen();
  }
}

//   Map coordinates
map.on("mousemove", function (e) {
  $(".coordinate").html(`Lat: ${e.latlng.lat} Lng: ${e.latlng.lng}` );
});

// Add below code from the leaflet.browser.print site
L.control.browserPrint({ position: "topright" }).addTo(map);

//   Load the Lakes geojson data

// L.geoJSON(data).addTo(map);

var marker = L.markerClusterGroup();
var marker1 = L.markerClusterGroup();
var marker2 = L.markerClusterGroup();
var marker3 = L.markerClusterGroup();
var lakes = L.geoJSON(data, {
  onEachFeature: function (feature, layer) {

    area = (turf.area(feature)/1000000).toFixed(3)
    console.log(area)

    label= `Name: ${feature.properties.NAME}<br>`
    label+= `Area: ${area}<br>`
    //Add popups
    layer.bindPopup(label);
  },
});
lakes.addTo(marker);

// styling
var style = {
  color: 'yellow',
  fillColor: '00FFFFFF'
}

var counties = L.geoJSON(counties, {
  style: style,
  onEachFeature: function (feature, layer) {

    label= `Name: ${feature.properties.ADM1_EN}<br>`
    label+= `Area: ${feature.properties.Area}<br>`

    layer.bindPopup(label)
  }
});
counties.addTo(marker1);

// ADD WMS VECTOR LAYER
var counties_wms = L.tileLayer.wms("http://localhost:8080/geoserver/Geospatial/wms", {
    layers: 'Geospatial:Counties',
    format: 'image/png',
    transparent: true,
    attribution: "Weather data © 2012 IEM Nexrad",
});
counties_wms.addTo(marker2)

// ADD WMS RASTER LAYER
var LandCover = L.tileLayer.wms("http://localhost:8080/geoserver/Geospatial/wms", {
    layers: 'Geospatial:LandCover',
    format: 'image/png',
    transparent: true,
    attribution: "",
});
LandCover.addTo(marker3)

//   marker.addTo(map);

//   Leaflet Search
L.Control.geocoder().addTo(map);

//   Leaflet Layer control
var baseMaps = {
  OSM: osm,
  ESRI: Esri_WorldImagery,
  MatbMap: MtbMap,
};

var overlayMaps = {
  "Kenya Lakes": marker,
  "Kenya Counties": marker1,
  "Kenya Counties wms": marker2,
  "Land Cover": marker3,
  "Center Marker": singleMarker,
};

L.control
  .layers(baseMaps, overlayMaps, { collapsed: true, position: "topleft" })
  .addTo(map);

//   Zoom to layer
$(".zoom-to-layer").click(function () {
  //Selector is a jquery function
  //The function sets the location to initial position
  map.setView([0.0236, 37.9062], 10);
});
