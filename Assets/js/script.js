var country;
var countries = [];
var cities = [];
var city;
var currencyCode;
var countryISO2;
var conversionRateGBP;
var conversionRateUSD;
var conversionRateEUR;
var pointsOfInterest = [];
var photoURL;

// Fetch local storage
let countryLog = JSON.parse(localStorage.getItem("countries"));

// Event listener and function for search button
$("#search").click(async function () {
    country = $("#countryInput").val();
    $("#country-info").addClass("d-none");
    $(".city-photo").addClass("d-none");
    $("#map").addClass("d-none");

    // Checks if already the country exist in the local storage
    if (countryLog != null) {
        if (countryLog.length > 0) {
            const index = countryLog.findIndex(elm => elm.name.toUpperCase() == country.toUpperCase());
            if (index > -1) {
                currencyCode = countryLog[index].currency;
                countryISO2 = countryLog[index].iso;
            } else {

                // Fetches country currency code and 2-letter ISO name
                await findCountryInfo(country);
                updateSearchLog();
            }
        }
    }
    // Fetches the name of 3 cities and their coordinates
    await findCities(countryISO2);

    // Fetches exchange rate
    findExchangeRate(currencyCode, "GBP");
    findExchangeRate(currencyCode, "USD");
    findExchangeRate(currencyCode, "EUR");

    // show cities' 
    for (let i = 0; i < cities.length; i++) {
        let latlong = cities[i].lat + "," + cities[i].long;
        await findPOI("monument", latlong, "rating");
        await findPhoto(pointsOfInterest[0].photoId);
        $(".city").eq(i).children().eq(0).attr("src", photoURL);
        $("h3").eq(i).text(cities[i].name);
    }
    $(".city-photo").removeClass("d-none");
    $("#exchange-rate").removeClass("d-none");
    $(".poi").removeClass("d-none");
    $("#country-info").removeClass("d-none");

    $("#poiselector").addClass("d-none");
    $(".city-name").addClass("d-none");
    $(".poi-address").addClass("d-none");
    $("#citydefault").removeClass("d-none");

    showExchangeRate();
})


function showExchangeRate() {

    //Updates the Exchange rate display text   
    $("td").eq(0).html("<img id='countryicon' src='./assets/images/imgGBP.png' alt='UK Currency Image'><span> GBP &nbsp; --> &nbsp; </span> ");
    $("td").eq(1).html(conversionRateGBP + " &nbsp  " + currencyCode);

    $("td").eq(2).html("<img id='countryicon'  src='./assets/images/imgUS.png' alt='US Currency Image'><span> USD &nbsp; -->&nbsp; </span> ");
    $("td").eq(3).html(conversionRateUSD + " &nbsp  " + currencyCode);

    $("td").eq(4).html("<img id='countryicon'  src='./assets/images/imgEUR.png'alt='Euro Currency Image'><span> EUR  &nbsp; -->&nbsp; </span>");
    $("td").eq(5).html(conversionRateEUR + " &nbsp " + currencyCode);
}

$("#poiselector").on("change", async function () {
    var x = document.getElementById("poiselector").value;
    if (x != "Select a point of interest" && x != "Map") {
        let index = cities.findIndex(elm => elm.name == city);
        const coord = cities[index].lat + "," + cities[index].long;

        await findPOI(x, coord, 'relevance');

        $(".poi-address").children(".poi-par").remove();

        for (let i = 0; i < 3 && i < pointsOfInterest.length; i++) {
            console.log(pointsOfInterest)
            $(".poi-address").append("<p class='ms-2 poi-par'><span id='span-poi'>Name: </span>" + pointsOfInterest[i].name + ",<br> <span id='span-poi'>Address: </span>" + pointsOfInterest[i].address + ",<br> <span id='span-poi'>Status: </span>" + pointsOfInterest[i].isOpen + "</p>");
        }
        $(".poi-address").removeClass("d-none");
    } else if (x == "Map") {
        // to map code
        searchCity();
        $("#map").removeClass("d-none");

    } else {
        $(".poi-address").addClass("d-none");
    }

});

// Event listener and function for city click
$(".city").click(function () {
    $(".poi-address").children(".poi-par").remove();
    city = $(this).children().eq(1).children().eq(0).text();
    $(".city-name").text(city);
    $("#poiselector").removeClass("d-none");
    $(".city-name").removeClass("d-none");
    $('#poiselector').get(0).selectedIndex = 0;
    $("#map").addClass("d-none");
    $("#citydefault").addClass("d-none");
})

// Updates local storage after each new query
function updateSearchLog() {
    let newCountry = { name: country, iso: countryISO2, currency: currencyCode };
    let countryLog = JSON.parse(localStorage.getItem("countries"));
    if (countryLog == null) {
        countries[0] = newCountry;
    } else {
        countries = countryLog;
        let index = countries.findIndex(element => (element.name).toUpperCase() == country.toUpperCase());
        if (index < 0) {
            for (let i = countries.length - 1; i >= 0; i--) {
                if (i < 10) countries[i + 1] = countries[i];
            }
            countries[0] = newCountry;
        }
    }

    localStorage.setItem("countries", JSON.stringify(countries));
}
// ************************* 