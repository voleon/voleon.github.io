ymaps.ready(init);

var map;
var defaultZoom = 16;
var userGeoLocation = null;
var objectManager = null;
var currentId = 0;

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

    objectManager = new ymaps.ObjectManager({
        // Включаем кластеризацию.
        clusterize: true,
        // Опции кластеров задаются с префиксом cluster.
        clusterHasBalloon: false,
        // Опции геообъектов задаются с префиксом geoObject
        geoObjectOpenBalloonOnClick: false
    });

    objectManager.objects.options.set('preset', 'islands#blueGlyphCircleIcon');
    objectManager.objects.options.set('iconGlyph', 'music');
    objectManager.objects.options.set('iconGlyphColor', 'blue');


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

    objectManager.removeAll();
    var myObjects = [];

    for(var i=0;i<test_data.length;i++){
        var point = test_data[i];
        if(point.lat >= min_lat && point.lat <= max_lat && point.lng >= min_lng && point.lng <= max_lng){

            myObjects.push({
                type: 'Feature',
                id: currentId++,
                geometry: {
                    type: 'Point',
                    coordinates: [point.lat/1e6, point.lng/1e6]
                },
                properties: {
                    balloonContent: "Содержимое балуна",
                    clusterCaption: "Еще одна метка",
                    hintContent: "Текст подсказки"
                }
            });
        }
    }

    objectManager.add(myObjects);
    map.geoObjects.add(objectManager);
}