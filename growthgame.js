 

  
		var layer = new L.StamenTileLayer("toner-background");
		var map = new L.Map("map", {
		    center: new L.LatLng(41.7154364,-71.6171092),
		    zoom: 10
		});
		map.addLayer(layer);
		
        var heat = L.heatLayer(Vietnamese,{
            opacity: .2,
            radius: 10,
            blur: 10, 
            maxZoom: 20,
            max: .2,
            gradient: {.3: "#F2F1EF", 1: "#e67e22" }
            // "#F2784B"
        }).addTo(map)
        ;
        
//Let the D3 begin!    
 
//Start the svg			
	map._initPathRoot()    
 
//Create Annotation Display
	var annosvg = d3.select("#anno").append("svg").attr("width", 300).attr("height", 100);
	var reviewsNum = annosvg.append("text");
	var reviewsText = annosvg.append("text");
    var nameText = annosvg.append("text");
 
//SANDBOX
// d3.selectAll(".filter_button").on("change", function() {
  // var type = this.value, 
  // // I *think* "inline" is the default.
  // display = this.checked ? "inline" : "none";
//     
 
var type = "Vietnamese";
 

//Create Main Map/D3 SVG
	var svg = d3.select("#map").select("svg"), g = svg.append("g");	
		d3.json("growthcenters.geojson", function(datajson) {
				datajson.features.forEach(function(d) {
				d.LatLng = new L.LatLng(parseFloat(d.geometry.coordinates[1]),parseFloat(d.geometry.coordinates[0]));
				})				
			var feature = g.selectAll("circle")
				   .data(datajson.features)
				   .enter()
				   .append("circle")
				   .attr("type", function(d, i) { return datajson.features[i].properties.Typology; })
				   .attr("class", "unselected")
				   .attr("r", 5)
 						
			function update() {
				  feature.attr("cx",function(d) { return map.latLngToLayerPoint(d.LatLng).x})
				  feature.attr("cy",function(d) { return map.latLngToLayerPoint(d.LatLng).y})
				  // feature.attr("r", 5)
				  feature.style("opacity", function(d) { return 1});
				  }
			map.on("viewreset", update);
		update();

// Establish our dataset
var typeSet = {
	CommercialMU: ["METACOM AVENUE","ROUTE 102 CORRIDOR","NOOSENECK HILL ROAD","PIER VILLAGE","SLATERSVILLE","BRANCH VILLAGE","WYOMING/RICHMOND COMMONS","ROUTE 7 CORRIDOR","BLISS CORNERS","I-95 EXIT 5/Whitebrook Village"],
    Corridor: ["I-95 EXIT 5/Whitebrook Village", "PROVIDENCE GROWTH CORRIDORS"],
    Downtown: ["BROAD STREET","DOWNTOWN PAWTUCKET", "PROVIDENCE AREAS OF CHANGE","DOWNTOWN WOONSOCKET"],
    Hamlet: ["SUMMIT", "ROUTE 6/94","HAMILTON ALLENTON","ALTON","RT138 / RT112"],
	MainSt: ["COUNTY ROAD","WEST MAIN ROAD","PORTSMOUTH TOWN CENTER","WAKEFIELD","UPPER MAIN ROAD","APPONAUG","ARCTIC","DOWNTOWN WESTERLY","WICKFORD"],
	Neighborhood: ["FORMER ZION BIBLE CAMPUS","KNIGHTSVILLE","ROLFE SQUARE","THORNTON","MANTON","HARTFORD AVE","GEORGIAVILLE","GREENVILLE","ESMOND","NATICK"],
	NewVillage: ["WEST CRANSTON VILLAGE","EXETER ROAD","I-95 INTERCHANGE","ROUTE 2/102","I-95 EXIT 1 HOPKINTON","EAST PROVIDENCE RIVERFRONT"],
	TraditionalVillage: ["PASCOAG","HARRISVILLE","NASONVILLE","CAROLINA","CROSS MILLS","CHEPACHET","JAMESTOWN VILLAGE","GRANITEVILLE","NEW/OLD HARBOR","LAFAYETTE","SHANNOCK","NORTH SCITUATE","HOPE","WEST KINGSTON","PEACE DALE","PAWTUXET"],
	Transit: ["WICKFORD JCT","WARWICK STATION"]
}

var types = d3.values(typeSet);
var dwarves = d3.shuffle(d3.keys(typeSet));

// Droppable items on the right
var draggables = d3.select(".draggables").append("ul");
draggables.selectAll("li").data(dwarves).enter()
	.append("li")
	.text(function(d) { return d })

// Drop targets on the left
var canvas = d3.select(".droptargets").append("svg")
	.attr("width",200)
	.attr("height",400)
	.attr("class","YlGn");

var dropTargets = feature;

// ---
// Handle dragging from HTML to dropping on SVG
// ---
var DragDropManager = {
	dragged: null,
	droppable: null,
	dropped: null,
	draggedMatchesTarget: function() {
		if (!this.droppable) return false;
		return (this.droppable.indexOf(this.dragged) >= 0);
		;
	// console.log(this.droppable)	
	}
}

var body = d3.select("body");

// Register the associated element as a potential target on mouseOver
// D3 events call listeners with the current datum
// and index, so this is straightforward.
dropTargets.on('mouseover',function(d,i){
	DragDropManager.droppable = datajson.features[i].properties.Typology; 
	DragDropManager.dropped = d3.select(this)[0][0]; 
	d3.select(this)
		.transition(250)
		.attr("r", 8);
						//Get this bar's x/y values, then augment for the tooltip
						var xPosition = parseFloat(d3.select(this).attr("cx")) + 5;
						var yPosition = parseFloat(d3.select(this).attr("cy")) - 5;
					d3.select("text").transition(1000);
					  svg
					  .append("text")
					  .text(datajson.features[i].properties.NAME)
					  .attr("x", xPosition)
					  .attr("y", yPosition)
					  .attr("text-anchor", "start")
					  .attr("font-family", "sans-serif")
					  .attr("font-size", "11px")
					  .attr("font-weight", "bold")
					  ;	
					  
					  console.log(datajson.features[i].properties.NAME);
							
});

// Clear the target from the DragDropManager on mouseOut.
dropTargets.on('mouseout',function(e){
	DragDropManager.droppable = null;
	d3.select(this).transition(1000).attr("r", 5);
	d3.select("text").remove();
}
// ;

);

// Set up jqueryUI's draggable on the list items
// 
// Note that we have to move helper out of the way of the cursor
// using the "cursorAt" property; otherwise the cursor will be 
// located over the helper and the SVG element's mouseover/mouseout
// events will not fire.

$(".draggables li").draggable({
	revert: true,
	revertDuration: 400,
	cursorAt: { left: -2, top: -2 }, 

	// Register what we're dragging with the drop manager
	start: function (e) {
		// Getting the datum from the standard event target requires more work.
		DragDropManager.dragged = d3.select(e.target).datum();
		// console.log(DragDropManager.dragged);
	},
	// Set cursors based on matches, prepare for a drop
	drag: function (e) {
		matches = DragDropManager.draggedMatchesTarget();
		body.style("cursor",function() {
			return (matches) ? "copy" : "move";
		});
		// Eliminate the animation on revert for matches.
		// We have to set the revert duration here instead of "stop"
		// in order to have the change take effect.
		$(e.target).draggable("option","revertDuration",(matches) ? 0 : 200)
	},
	// Handle the end state. For this example, disable correct drops
	// then reset the standard cursor.
	stop: function (e,ui) {
		matches = DragDropManager.draggedMatchesTarget();			
		console.log(DragDropManager.dropped);
		// Dropped on a non-matching target.
		if (!DragDropManager.draggedMatchesTarget()) {
		// d3.select(DragDropManager.dropped).attr("class", "wrong").attr("r", 10);
		$('#wrong').fadeIn(750).delay(500).fadeOut(500)
		}
		if (matches) {
		d3.select(DragDropManager.dropped).attr("class", "right").attr("r", 10);
		$('#right').fadeIn(500).delay(250).fadeOut(500)

		}	
	}
});


}) 


    <script type="text/javascript" src="http://maps.stamen.com/js/tile.stamen.js?v1.2.4"></script>
	<script src="http://cdn.leafletjs.com/leaflet-0.7.2/leaflet.js"></script>  
	<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7/leaflet.css"/>	  
    <script type="text/javascript" src="http://d3js.org/d3.v3.min.js"></script>
    <script src="http://leaflet.github.io/Leaflet.heat/dist/leaflet-heat.js"> </script>
    <script type="text/javascript" src="http://maps.stamen.com/js/tile.stamen.js?v1.2.4"></script>
	<link rel="stylesheet" type="text/css" href="map.css"> 
    <script src="geotoarray.js"></script>
