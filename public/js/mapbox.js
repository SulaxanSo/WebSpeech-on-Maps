mapboxgl.accessToken = 'pk.eyJ1Ijoic3VsYXhhbjI3IiwiYSI6ImNpc3JqNXRidTAwNHAyeXBiY2hxdnlsMG4ifQ.IGQkafPlHEjq7_hno0AnrA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v10',
  center: [7.628694, 51.962944],
  zoom: 11
});

//Add navigation control to rotate and pan the map
map.addControl(new mapboxgl.NavigationControl());

//Add fullscreen control to switch to fullscreen mode
//map.addControl(new mapboxgl.FullscreenControl());

// Add geolocate control to the map.
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));

//Add mapbox direction to get navigation system
/*map.addControl(new MapboxDirections({
    accessToken: mapboxgl.accessToken
}), 'top-left');
*/

var elementListe = [];

function layercontrol(element,geojson){

    if(elementListe.includes(element)){

      map.getSource(element).setData(geojson);

      var layer = map.getSource(element);
      console.log(layer._data.features);
    }else{

      elementListe.push(element);
      console.log(elementListe);

      map.addSource(element, { type: 'geojson', data: geojson });
      map.addLayer({
          "id": element,
          "type": "symbol",
          "source": element,
          "layout": {
              "visibility": "visible",
              "icon-image": "{icon}-15",
              "icon-size": 1.5,
              "icon-allow-overlap": true
          }
      });

      map.on('click', element, function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
      });

      var link = document.createElement('a');
      link.href = '#';
      link.className = 'active';
      link.textContent = element;

      link.onclick = function (e) {
          var clickedLayer = this.textContent;
          e.preventDefault();
          e.stopPropagation();

          var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

          if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
          } else {
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
          }
      };

      var layers = document.getElementById('menu');
      layers.appendChild(link);

      var layer = map.getSource(element);
      console.log(layer._data.features);
    }

}


$(window).on("beforeunload", function() {
			return "Are you sure? You didn't finish the form!";
		});

$(document).ready(function() {
	$('index').on("submit", function(e) {
		$(window).off("beforeunload");
		return true;
	});
});
