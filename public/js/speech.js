var listeGeld = [];
var listeAmpel = [];

function spracheErkennen(){
  var speechElement = webkitSpeechRecognition || SpeechRecognition;
  var speechElement = new speechElement();
  speechElement.lang = 'de-DE';
  //speechElement.continuous = true;
  var final_transcript = '';
  speechElement.start();

  speechElement.onresult = function(event){
    var interim_transcript ='';
    for(var i = event.resultIndex; i < event.results.length; ++i){
      if(event.results[i].isFinal){
        final_transcript += event.results[i][0].transcript;
      } else {
          interim_transcript += event.results[i][0].transcript;
      }
    }

  text = final_transcript;
  console.log(text)

  currentCenter = map.getCenter();

  var popupStart = new mapboxgl.Popup({anchor: 'center', closeButton: false})
  .setLngLat([currentCenter.lng, currentCenter.lat])
  .setHTML("<h1>"+text+"</h1>")
  .addTo(map);

  setTimeout(function(){
        popupStart.remove()
    }, 2000);

  if (text == "hineinzoomen"){
    map.zoomIn();
  }else if (text == "herauszoomen") {
    map.zoomOut();
  }else if (text == "nach links schwenken"){
    map.panTo([currentCenter.lng+0.03, currentCenter.lat]);
  }else if (text == "nach rechts schwenken"){
    map.panTo([currentCenter.lng-0.03, currentCenter.lat]);
  }else if (text == "nach oben schwenken"){
    map.panTo([currentCenter.lng, currentCenter.lat-0.03]);
  }else if (text == "nach unten schwenken"){
    map.panTo([currentCenter.lng, currentCenter.lat+0.03]);
  }else if (text == "Standort anzeigen"){
    var options = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 300000
    };

    function success(pos) {
      var crd = pos.coords;

      var geojson = {
              "type": "FeatureCollection",
              "features": [{
                  "type": "Feature",
                  "geometry": {
                      "type": "Point",
                      "coordinates": [crd.longitude,crd.latitude]
                  },
                  "properties": {
                      "description": "<strong>Mein Standort</strong>",
                      "icon": "embassy"
                  }
               }]
          };
      map.flyTo({center: [crd.longitude,crd.latitude], zoom: 15});
      layercontrol("Standort",geojson);
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
  }else if (text == "Geldautomat hinzufügen"){
    var options = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 300000
    };

    function success(pos) {
      var crd = pos.coords;

      var geojson = {
              "type": "FeatureCollection",
              "features": listeGeld
          };

      function Geldautomat(long,lat){
        this.long = long;
        this.lat = lat;

        var platzhalter = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [long,lat]
                    },
                    "properties": {
                        "description": "<strong>Geldautomat</strong>",
                        "icon": "bank"
                    }
                };
        return platzhalter;
      }

      map.flyTo({center: [crd.longitude,crd.latitude], zoom: 15});
      var geldautomat = new Geldautomat(crd.longitude,crd.latitude);
      listeGeld.push(geldautomat);

      /*map.flyTo({center: [crd.longitude,crd.latitude], zoom: 15});

      var el = document.createElement('div');
      el.className = 'geldautomat';
      var geldautomat = new mapboxgl.Marker(el)
      .setLngLat([crd.longitude,crd.latitude])
      .addTo(map);
*/
      layercontrol("Geldautomat",geojson);
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
  }else if (text == "defekte Ampel hinzufügen"){
    var options = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 300000
    };

    function success(pos) {
      var crd = pos.coords;

      var geojson = {
              "type": "FeatureCollection",
              "features": listeAmpel
          };

      function Ampel(long,lat){
        this.long = long;
        this.lat = lat;

        var platzhalter = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [long,lat]
                    },
                    "properties": {
                        "description": "<strong>defekte Ampel</strong>",
                        "icon": "car"
                    }
                };
        return platzhalter;
      }

      map.flyTo({center: [crd.longitude,crd.latitude], zoom: 15});
      var ampel = new Ampel(crd.longitude,crd.latitude);
      listeAmpel.push(ampel);

      layercontrol("Ampel",geojson);
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
  }else if(text == "Standort teilen"){

    var layer = map.getSource("Standort");
    console.log(layer);
    if(layer == undefined){
      var text = "Standort erst anzeigen lassen."
      var popup = new mapboxgl.Popup({anchor: 'center', closeButton: false})
      .setLngLat([currentCenter.lng, currentCenter.lat])
      .setHTML("<h1>"+text+"</h1>")
      .addTo(map);

      setTimeout(function(){
            popup.remove()
        }, 3000);
    }else{
    var lat = layer._data.features[0].geometry.coordinates[1];
    var lon = layer._data.features[0].geometry.coordinates[0];
    var data = JSON.stringify(layer._data);
    var link = "https://www.google.com/maps/place/"+lat+"+"+lon+"/@"+lat+","+lon+",15z";
    console.log(lat, lon);
    console.log(link);

    if( navigator.share !== undefined ){
                let ttl = "Mein Standort";
                let txt = link;
                let url = "";

                navigator.share( {title: ttl, text: txt} )
                    .then( _ => console.log('success.') )
                    .catch( (err) => console.log( err ) );
    }else{
        console.log('navigator.share is not supported here.');
    }
  }
  }else if(text == "Geldautomaten teilen"){

    var layer = map.getSource("Geldautomat");

    if(layer == undefined){
      var text = "Es wurden keine Geldautomaten hinzugefügt."
      var popup = new mapboxgl.Popup({anchor: 'center', closeButton: false})
      .setLngLat([currentCenter.lng, currentCenter.lat])
      .setHTML("<h1>"+text+"</h1>")
      .addTo(map);

      setTimeout(function(){
            popup.remove()
        }, 3000);
    }else{
    var alleGeldautomaten = layer._data.features;
    console.log(alleGeldautomaten);

    var link = "https://www.google.com/maps/dir/";
    for(var i = 0; i < alleGeldautomaten.length;i++){
      var lat = alleGeldautomaten[i].geometry.coordinates[1];
      var lon = alleGeldautomaten[i].geometry.coordinates[0];
      link = link + lat + "," + lon + "/";
    }
    link = link + "/@51.969305,7.596817,11z";
    console.log(link);

    if( navigator.share !== undefined ){
                let ttl = "Meine Geldautomaten";
                let txt = link;
                let url = "";

                navigator.share( {title: ttl, text: txt} )
                    .then( _ => console.log('success.') )
                    .catch( (err) => console.log( err ) );
    }else{
        console.log('navigator.share is not supported here.');
    }
  }

  }else if(text == "defekte Ampel teilen"){

    var layer = map.getSource("Ampel");

    if(layer == undefined){
      var text = "Es wurden keine defekte Ampeln hinzugefügt."
      var popup = new mapboxgl.Popup({anchor: 'center', closeButton: false})
      .setLngLat([currentCenter.lng, currentCenter.lat])
      .setHTML("<h1>"+text+"</h1>")
      .addTo(map);

      setTimeout(function(){
            popup.remove()
        }, 3000);
    }else{
    var alleAmpeln = layer._data.features;
    console.log(alleAmpeln);

    var link = "https://www.google.com/maps/dir/";
    for(var i = 0; i < alleAmpeln.length;i++){
      var lat = alleAmpeln[i].geometry.coordinates[1];
      var lon = alleAmpeln[i].geometry.coordinates[0];
      link = link + lat + "," + lon + "/";
    }
    link = link + "/@51.969305,7.596817,11z";
    console.log(link);

    if( navigator.share !== undefined ){
                let ttl = "Meine Ampeln";
                let txt = link;
                let url = "";

                navigator.share( {title: ttl, text: txt} )
                    .then( _ => console.log('success.') )
                    .catch( (err) => console.log( err ) );
    }else{
        console.log('navigator.share is not supported here.');
    }
  }
  }else {

    var text = "Kann nicht verarbeitet werden."
    var popup = new mapboxgl.Popup({anchor: 'center', closeButton: false})
    .setLngLat([currentCenter.lng, currentCenter.lat])
    .setHTML("<h1>"+text+"</h1>")
    .addTo(map);

    setTimeout(function(){
          popup.remove()
      }, 3000);
  }
  }
}
