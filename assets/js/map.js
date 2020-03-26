//set global letiables
let map, places, infowindow;
let markers = [];
let bounds;
let searchTerm;
let searchBox;
let icon;
let marker;

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

            // set options for place icon
            icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // sets content for text in infowindow
            let contentString = {
                fields: ['name', 'formatted_address']
            };

            // create infowindow for place info
            let infowindow = new window.google.maps.InfoWindow({
                content: contentString
            });

            //set bouds of map to viewport
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

$('.placeButton').on('blur', function () {

});

function showCafes() {

    let request = {
        bounds: map.getBounds(),
        type: ['cafe']
    };

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
        }
    }

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

}

function createMarker(place) {
                // Create a marker for each place.
            marker = new google.maps.Marker({
                map: map,
                icon: place.icon,
                title: place.name,
                position: place.geometry.location
            })

            // listens for click and adds place name and address
            marker.addListener('click', function () {
                infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                    place.formatted_address + '</div>');
                infowindow.open(map, this);
                infowindow.open(map, marker);
            });

            // add marker to location
            markers.push(marker)
}