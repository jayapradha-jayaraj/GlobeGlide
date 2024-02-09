const options = { method: 'GET', headers: { 'X-Api-Key': 'UYHVU5B+LjMVjZAbP8GT/g==Kzbasplb9sgyJOmq' }, };
async function findCountryInfo(country) {

    const countryURL = "https://api.api-ninjas.com/v1/country?name=" + country;


    await fetch(countryURL, options)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            currencyCode = data[0].currency.code;

            countryISO2 = data[0].iso2;
        });
}

async function findCities(countryISO) {
    var cityURL = "https://api.api-ninjas.com/v1/city?limit=4&country=" + countryISO;

    await fetch(cityURL, options)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            if (data != null) {
                for (let i = 0; i < 3 && i < data.length; i++) {
                    let cityInfo = { name: "", long: "", lat: "" };
                    cityInfo.name = data[i].name;
                    cityInfo.long = data[i].longitude;
                    cityInfo.lat = data[i].latitude;
                    cities[i] = cityInfo;
                }
            }
        });
}