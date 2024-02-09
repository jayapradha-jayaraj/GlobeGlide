// This script gets coordinates of a city and place and return a url to a photo of the place

// fetchPlaces("glasgow", "monuments", "rating")
// sort: popular or newest  
// Gets city name and fetches coordinates of the city

async function findPhoto(fsq_id) {
  const options = { method: 'GET', headers: { accept: 'application/json', Authorization: 'fsq3uGJyqb8GYslDA9kCvLI2OQWCPzUPl2HYay7NK0Lzjpw=', } };

  await fetch(`https://api.foursquare.com/v3/places/${fsq_id}/photos`, options)
    .then(response => response.json())
    .then(function (data) {
      if (data != null) {
        photoURL = data[0].prefix + "original" + data[0].suffix;

      }
    })
    .catch(err => console.error(err));

}
