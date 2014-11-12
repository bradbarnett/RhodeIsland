
	
	function initmap() {
	// set up the map
	map2 = new L.Map('map2');

	// create the tile layer with correct attribution
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 18, attribution: osmAttrib});		

	// start the map in South-East England
	map2.setView(new L.LatLng(41.705428, -71.543101),10);
	map2.addLayer(osm);
	// new L.geoJson(gc, {
        // style: myStyle
    // }).addTo(map);
//    
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

new L.geoJson(gc, 
	{
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(map2);

}
initmap();

$(function() {
	$('button').click( function() {
		$("#leaflet-marker-pane").hide();
	});
});