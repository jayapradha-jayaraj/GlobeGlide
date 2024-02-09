let map;

function initMap() {
    // Initial map options
    var options = {
        center: { lat: 38.3460, lng: -0.4907 },
        zoom: 12
    };

    // New map
    map = new google.maps.Map(document.getElementById("map"), options);
    console.log(map)
}

function searchCity() {
    if (!city) return;

    // Geocode the city name
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': city }, function (results, status) {
        if (status == 'OK') {
            // Center the map on the city
            map.setCenter(results[0].geometry.location);

            // Add a marker for the city
            new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });

        } else {
            console.log('Geocode was not successful for the following reason: ' + status);
        }
    });
}

