// Gets latlong (latitude + "," + longitude) of a city, a poi name and sort and returns 3 names, address and openness
// of places
// The poi could be: coffee, restaurant, museum, shopping center,cinema, hotel, monument
// sort (for places): relevance (default), rating, distance
// the return objects are saved in pointOfInterest array 
// for all places sort would be 'DISTANCE'

async function findPOI(poi, latlong, sort) {
    await placeSearch().then(
        function (data) {
            if (data != null) {
                for (let i = 0; i < data.results.length && i < 3; i++) {
                    let place = { name: "", address: "", isOpen: "", photoId: "" };
                    place.name = data.results[i].name;
                    place.address = data.results[i].location.formatted_address;
                    place.isOpen = data.results[i].closed_bucket;
                    place.photoId = data.results[i].fsq_id;
                    pointsOfInterest[i] = place;

                }
            }
        },
    );


    async function placeSearch() {
        try {
            const searchParams = new URLSearchParams({
                query: poi,
                ll: latlong,
                sort: sort
            });
            const result = await fetch(
                `https://api.foursquare.com/v3/places/search?${searchParams}`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'fsq3uGJyqb8GYslDA9kCvLI2OQWCPzUPl2HYay7NK0Lzjpw=',
                    }
                }
            );
            const data = await result.json();
            return data;
        } catch (err) {
            console.error(err);
        }
    }
}

