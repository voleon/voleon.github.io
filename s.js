ymaps.ready(init);

var map;
var defaultZoom = 16;
var userGeoLocation = null;

function init () {
    map = new ymaps.Map('map', {
        center: [57.630968, 39.840817],
        zoom: defaultZoom,
        controls: [],
        behaviors: []
    });
    map.container.fitToViewport();

    map.events.add('boundschange', function (event) {
        load(event.get('newBounds'))
    });

    //var point = new ymaps.Placemark([57.630968, 39.840817], {}, {
    //    preset: 'islands#blueGlyphCircleIcon',
    //    iconGlyph: 'music',
    //    iconGlyphColor: 'blue',
    //    zIndex: 100
    //});
    //map.geoObjects.add(point);

    getGeo();
    setInterval(getGeo, 1000);
}

function getGeo() {
    ymaps.geolocation.get({
        provider: "browser"
    }).then(function (result) {
        if(!userGeoLocation){
            userGeoLocation = new ymaps.Placemark(result.geoObjects.position, {}, {
                preset: 'islands#geolocationIcon',
                zIndex: 1
            });
            map.geoObjects.add(userGeoLocation);
        }else{
            userGeoLocation.geometry.setCoordinates(result.geoObjects.position);
        }
        map.setCenter(result.geoObjects.position, defaultZoom, {duration:500});
    });
}

function load(bounds){
    var max_lat = Math.floor(bounds[1][0] * 1e6);
    var min_lat = Math.floor(bounds[0][0] * 1e6);
    var max_lng = Math.floor(bounds[1][1] * 1e6);
    var min_lng = Math.floor(bounds[0][1] * 1e6);

    map.geoObjects.removeAll();

    for(var i=0;i<test_data.length;i++){
        var point = test_data[i];
        if(point.lat >= min_lat && point.lat <= max_lat && point.lng >= min_lng && point.lng <= max_lng){
            var p = new ymaps.Placemark([point.lat/1e6, point.lng/1e6], {}, {
                preset: 'islands#blueGlyphCircleIcon',
                iconGlyph: 'music',
                iconGlyphColor: 'blue',
                zIndex: 100
            });
            map.geoObjects.add(p);
        }
    }

    map.geoObjects.add(userGeoLocation);
}