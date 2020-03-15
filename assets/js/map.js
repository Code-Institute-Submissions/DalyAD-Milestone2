//set global variables
let map, places, infowindow;
let markers = [];
var searchTerm;

//initialise map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 51.898470, lng: -8.475591 },
        zoom: 13,
        mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
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
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }

            // set options for place icon
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // sets content for text in infowindow
            var contentString = {
                fields: ['name', 'formatted_address']
            };

            // create infowindow for place info
            var infowindow = new window.google.maps.InfoWindow({
                content: contentString
            });

            // Create a marker for each place.
            var marker = new google.maps.Marker({
                map: map,
                icon: icon,
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

document.getElementById('pac-input').onclick = function () {
    var input = document.getElementById('cafes');

    google.maps.event.trigger(input, focus, {});
    google.maps.event.trigger(input, keydown, { keycode: 13 });
    google.maps.event.trigger(this, focus, {});
}
