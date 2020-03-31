//set global letiables
let map, places, place, infowindow;
let markers = [];
let bounds;
let searchTerm;
let searchBox;
let icon;
let marker;
let contentString;

//initialise map
function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 51.898470, lng: -8.475591 },
        zoom: 13,
        mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    let input = document.getElementById('searchMap');
    searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }

            //set bounds of map to viewport
            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });



        //set map to fit bounds of zoom
        map.fitBounds(bounds);
    });
}

function createMarker(place) {

    icon = {
        url: "assets/css/images/location-pin.png",
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
    };

    // Create a marker for each place
    marker = new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        animation: google.maps.Animation.DROP,
        position: place.geometry.location
    })



    // listens for click and adds place name and address
    google.maps.event.addListener(marker, 'click', (function (marker) {
        return function () {
            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + place.vicinity + '</div>');
            infowindow.open(map, marker);
        }
    })(marker));

    // add marker to location
    markers.push(marker)
}

/**
 * shows points of interest on the map
 * @param {string} type type to be displayed
 */
function showPOIs(type) {

    let request = {
        bounds: map.getBounds(),
        type: [type]
    };

    markers.forEach(function (marker) {
        marker.setMap(null);
    });
    markers = [];

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
        }
    }

    // sets content for text in infowindow
    contentString = {
        fields: ['name', 'vicinity']
    };

    // create infowindow for place info
    infowindow = new window.google.maps.InfoWindow()

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

}