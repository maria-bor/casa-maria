var map;

function initialize() {

    document.getElementById('map-canvas').style.height = document.getElementById('body').clientHeight + 'px';

    var mapOptions = {
        zoom: 15,
        center: new google.maps.LatLng(28.376767, -16.706723)
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);