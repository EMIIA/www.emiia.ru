// Add map 
var mymap = L.map('mapid', { zoomControl: false }).setView([64.145059, -21.953024], 14);
mymap.on("search:locate", function(content){
    var latlng = L.latLng(content.lat, content.lon);
    var marker = L.marker(latlng);
    mymap.flyTo(latlng, 11);
    marker.addTo(mymap);
})

var searchLoc = new L.Control.Search({ 
    position: 'topleft' , 
    infoField: function(content){
        var latlng = "Lat: " + Math.round(content.lat * 10000) / 10000 + ", Lon: " + Math.round(content.lon * 10000) / 10000;
        var nameSplitted = content.display_name.split(", ");
        console.log(nameSplitted);
        var nameShown = "Luogo: <b>" + nameSplitted[0] + "</b>, <br>" + "Area: <b>" + nameSplitted[2] + "</b>, <br>" + latlng;
        
        return nameShown;               // Mostra nome filtrato e coordinate
}});
searchLoc.addTo(mymap);
 
// Add base layers
var basemap1 = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1
	})

var basemapOSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
});    

var basemapEsriWorldStreetMap = L.tileLayer
('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Source: Esri'
});

var basemapOpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Layer trasparente di etichette
var CartoDB_label = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png', { attribution: '&copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

///////////////////////////////////////////////////////////////////
//https://leafletjs.com/examples/extending/extending-1-classes.html
///////////////////////////////////////////////////////////////////

L.Control.Watermark = L.Control.extend({
    onAdd: function(map) {
        var img = L.DomUtil.create('img');

        img.src = 'https://zenprospect-production.s3.amazonaws.com/uploads/pictures/5e05afa36bb0100001ae7daf/picture';
        img.style.width = '45px';
        L.DomUtil.setOpacity(img, 0.75);

        L.DomEvent.on(img, 'click', function(ev){
            //L.DomEvent.stopPropagation(ev);
            alert("You clicked on the logo of TerrAria.")
        });
 
        return img;
    },
 
    onRemove: function(map) {
        // Nothing to do here
    }
});

var ImageTerrAria = new L.Control.Watermark({position: 'topright'});
ImageTerrAria.addTo(mymap);

///////////////////////////////////////////////////////////

// Create layer markers
    var layerNewPlaces = new L.layerGroup([]);
     
// Create other elements
    var namePlace = "";
    var nameLoc = "inizio";
    var popup;
    var toasts = new L.Control.Toast({position:'bottomright', summary : true, life : 4000, sticky: false});
    toasts.addTo(mymap);

function saveNamePlace(e) {
        
        var newPlace = new L.Marker([e.lat, e.lng]);

        namePlace = document.getElementById("namePlaceText").value;
        popup.remove();
        layerNewPlaces.addLayer(newPlace);
        newPlace.bindPopup('You have already visited this place.' + '<br><b>' + namePlace + '</b><br>Latitude: ' + Math.round(e.lat*1000)/1000 + '<br>Longitude: ' + Math.round(e.lng*1000)/1000).openPopup();
        };

L.Control.AddPoint = L.Control.extend({
    active : 0,
    img : undefined,

    onAdd: function(map) {
        this.img = L.DomUtil.create('img'); 

        this.img.src = 'https://cdn2.iconfinder.com/data/icons/location-41/100/259-512.png';
        this.img.style.width = '35px';
        L.DomUtil.setOpacity(this.img, 0.75);

        L.DomEvent.on(this.img, 'click', this._buttonClick, this); 

        return this.img;
    },
  
    onRemove: function(map) {
        // Nothing to do here
        L.DomEvent.off(this.img, 'click', this._buttonClick, this); 
    },

    _onMapClick : function(e) {
        L.DomEvent.stopPropagation(e);
        var eee = "saveNamePlace(".concat(JSON.stringify(e.latlng), ")");
        var event = "javascript".concat(eee);
        popup = L.popup({
            closeButton: true,
            autoClose: false
            })
            .setLatLng([e.latlng.lat, e.latlng.lng])
            .setContent('<p>Enter the name of the selected location:</p>   <input type="text" id="namePlaceText" placeholder="Enter name here..." class="placeName">  <br><br><br>                                            <button id="PopName" onclick=\''+eee+'\' ><input type="image" src="img/saveLogo.jpg" name="image" width="25" height="25"> <br>Save location</button>')
            .openOn(mymap);
   
        //var placeName = prompt("Please enter the name of this place.", "Enter name here");

    },

    
    _buttonClick : function(ev) {
        L.DomEvent.stopPropagation(ev);
        if (this.active === 0) {
            //alert("Do you want to add a place that you have visited? \nClick on the map to select it.");
            this.active = 1;
            this.img.src = 'https://image.flaticon.com/icons/svg/1692/1692911.svg';

            mymap.on('click', this._onMapClick, this);
            
            toasts.success ({title:"Ottimo!", text: 'Stai aggiungendo una nuova località!'});

            // SPOSTA FIGURA IN SELEZIONE
            /*mymap.removeControl(ImageTerrAria);
            ImageTerrAria.options.position = 'topleft';
            ImageTerrAria.addTo(mymap);*/

        } else {
            //alert("Do you want to stop adding places that you have visited?");
            this.img.src = 'https://cdn2.iconfinder.com/data/icons/location-41/100/259-512.png';

            this.active = 0;
            mymap.off('click', this._onMapClick, this);

            toasts.warn ({title:"Nooo!", text: 'Non stai più aggiungendo una nuova località!'});

            // SPOSTA FIGURA IN SELEZIONE
            /*mymap.removeControl(ImageTerrAria);
            ImageTerrAria.options.position = 'topright';
            ImageTerrAria.addTo(mymap);*/
        }
    }
});


var ImageAddPoint = new L.Control.AddPoint({position: 'topright'});
ImageAddPoint.addTo(mymap);



L.Control.DeleteAll = L.Control.extend({
    onAdd: function(map) {
        var img = L.DomUtil.create('img'); //ButtonDeleteAll
 
        img.src = 'https://image.flaticon.com/icons/png/512/61/61848.png';
        img.style.width = '30px';
        L.DomUtil.setOpacity(img, 0.75);

        L.DomEvent.on(img, 'click', function(ev){
            L.DomEvent.stopPropagation(ev);
            //alert("Do you want to delete the places that you have visited so far?");
            layerNewPlaces.clearLayers();

            toasts.error ({title:"Nooo!", text: 'Hai cancellato tutto'});

        });

        return img;
    },

    onRemove: function(map) {
        // Nothing to do here
    }
});

var ImageDeleteAll = new L.Control.DeleteAll({position: 'topright'});
ImageDeleteAll.addTo(mymap);

///////////////////////////////////////////////////////////////////
// Create personalised icon home
var pinHome = L.icon({iconUrl: 'https://images.vexels.com/media/users/3/142675/isolated/preview/84e468a8fff79b66406ef13d3b8653e2-house-location-marker-icon-by-vexels.png', iconSize:[50, 50]});

// Crea LayerGroup in cui inserire tutti i punti
var markerHomeOptions = {
	title: "Home, click for more info",
	clickable: true,
	//draggable: true,
    icon: pinHome
};
var markerHome = new L.Marker([64.145059, -21.953024], markerHomeOptions);
markerHome.bindPopup('<b>Home</b>' + '<br>Latitude: ' + markerHome.getLatLng().lat + '<br>Longitude: ' + markerHome.getLatLng().lng)
markerHome.addTo(mymap);


// Create TOC
L.control.layers({
    'Mappa di base 1': basemap1, 
    'OpenStreetMap': basemapOSM, 
    'Esri WorldStreetMap' : basemapEsriWorldStreetMap, 
    'OpenTopoMap': basemapOpenTopoMap}, 
    {
    'Labels': CartoDB_label,
    'Places': layerNewPlaces
},{ 
    position: 'topleft' 
}).addTo(mymap);

// Seleziono la mappe base di default
basemap1.addTo(mymap);
layerNewPlaces.addTo(mymap);

// Add measure distances
L.control.polylineMeasure({position: 'topright'}).addTo(mymap);

// Add zoom control
new L.Control.Zoom({ position: 'topright' }).addTo(mymap);

// Add bars with drawing functions
mymap.pm.addControls({
  position: 'bottomright' 
	//https://github.com/geoman-io/leaflet-geoman#installationfunzioni
});

// Add show coordinates of mouse position
L.control.mousePosition({emptystring: "Point to the map to show coordinates"}).addTo(mymap);

// Add full screen button
mymap.addControl(new L.Control.Fullscreen({
    title: {
        'false': 'View Fullscreen',
        'true': 'Exit Fullscreen'
    }
}));

// Add scale
var scale = L.control.scale();
scale.addTo(mymap);

