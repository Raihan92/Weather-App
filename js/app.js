// API KEY
const key = "31957d5cc16e6a30f2a6ae23f0f3ed0c";

let weatherData = {}

var searchCriteria = {
    city: "",
    country: "",
    lat: "",
    lon: ""
};

var er = {
    message: "Location not found",
    code: "404"
}

const weatherNotifyElmnt = document.querySelector('.weather-notification');
const weathergeoLocElmnt = document.querySelector('.weather-geo-location h3');
const weatherIconElmnt = document.querySelector('.weather-icon');
const weatherDescriptionElmnt = document.querySelector('.weather-description p');
const weatherValueElmnt = document.querySelector('.weather-value p');
const weatherValueFeelsElmnt = document.querySelector('.weather-value-feels-like p');
const weatherHumidityElmnt = document.querySelector('.weather-humidity p');
const weatherVisibilityElmnt = document.querySelector('.weather-visibility p');
const weatherWindSpeedElmnt = document.querySelector('.weather-wind-speed p');
const weatherCloudElmnt = document.querySelector('.weather-cloud p');
const weatherSunriseElmnt = document.querySelector('.weather-sunrise p');
const weatherSunsetElmnt = document.querySelector('.weather-sunset p');

$(document).ready( function() {

    if (navigator.geolocation) {

        weatherNotifyElmnt.style.display = "none";
        weatherNotifyElmnt.innerHTML = "<p></p>";
        navigator.geolocation.getCurrentPosition(setPosition, showError);

    } else {
        weatherNotifyElmnt.style.display = "block";
        weatherNotifyElmnt.innerHTML = "<p>Your browser doesn't support geolocation.</p>";
    }
});

$(document).ready( function() {
    
    $('#searchform').on('submit', function(e) {

        e.preventDefault()

        weatherNotifyElmnt.style.display = "none";
        weatherNotifyElmnt.innerHTML = "<p></p>";

        let city = $('#city-code').val();
        var ctVal = document.getElementById("country-list");
        let country = ctVal.options[ctVal.selectedIndex].value;

        console.log(city + ", " +country);

        if (city && country) {
            searchCriteria.city = city;
            searchCriteria.country = country;
            getWeather(searchCriteria);
        } else if (city) {
            searchCriteria.city = city;
            searchCriteria.country = "";
            getWeather(searchCriteria);
        } else {
            window.location.reload();
        }
    });
});

function getWeather(searchCriteria) {

    let api = "";
    if (searchCriteria.city && searchCriteria.country)
        api = `https://api.openweathermap.org/data/2.5/weather?q=${searchCriteria.city},${searchCriteria.country}&appid=${key}`;
    else if (searchCriteria.city && searchCriteria.country == "")
        api = `https://api.openweathermap.org/data/2.5/weather?q=${searchCriteria.city}&appid=${key}`;
    else
        api = `https://api.openweathermap.org/data/2.5/weather?lat=${searchCriteria.lat}&lon=${searchCriteria.lon}&appid=${key}`;
    
    $.ajax({
        type: 'GET',
        url: api,
        dataType: "json",
        success: function(data) {

            weatherData.temperatureMain = Math.floor(data.main.temp - 273);
            weatherData.temperatureFeelsLike = Math.floor(data.main.feels_like - 273);
            weatherData.humidity = data.main.humidity;
            weatherData.visibility = data.visibility;
            weatherData.windSpeed = data.wind.speed;
            weatherData.cloudiness = data.clouds.all;
            weatherData.description = data.weather[0].description.toUpperCase();
            weatherData.iconId = data.weather[0].icon;
            geoLoc = (data.name + ", " + data.sys.country).toUpperCase();
            weatherData.geolocation = geoLoc;
            weatherData.sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            weatherData.sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

            displayWeatherData();
        },
        error: function(data) {
            console.clear();
            showError(er);
        }
    })
}

function setPosition(position) {

    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    console.log("Lat = " + latitude + ", Lon = " + longitude);

    searchCriteria.lat = latitude;
    searchCriteria.lon = longitude;

    getWeather(searchCriteria);
}

function showError(error) {
    weatherNotifyElmnt.style.display = "block";
    weatherNotifyElmnt.innerHTML = `<p> ${error.message} </p>`;
}

function displayWeatherData() {

    weatherValueElmnt.innerHTML = `<p>Absolute<br><span class="value-large">${weatherData.temperatureMain}°C</span></p>`;
    weatherValueFeelsElmnt.innerHTML = `<p>Real Feel<br><span class="value-large">${weatherData.temperatureFeelsLike}°C</span></p>`;
    weatherIconElmnt.innerHTML = `<img src="/icons/${weatherData.iconId}.png"/>`;
    weatherDescriptionElmnt.innerHTML = `${weatherData.description}`;
    weathergeoLocElmnt.innerHTML = `<h3><i class="fa fa-map-marker" aria-hidden="true"></i>  ${weatherData.geolocation}</h3>`;
    weatherHumidityElmnt.innerHTML = `<p>Humidity<br><span class="value-large">${weatherData.humidity}%</span></p>`;
    weatherVisibilityElmnt.innerHTML = `<p>Visibility<br><span class="value-large">${weatherData.visibility} m</span></p>`;
    weatherWindSpeedElmnt.innerHTML = `<p>Wind speed<br><span class="value-large">${weatherData.windSpeed} m/s</span></p>`;
    weatherCloudElmnt.innerHTML = `<p>Cloudiness<br><span class="value-large">${weatherData.cloudiness}%</span></p>`;
    weatherSunriseElmnt.innerHTML = `<p>Sunrise<br><span class="value-large">${weatherData.sunrise}</span></p>`;
    weatherSunsetElmnt.innerHTML = `<p>Sunset<br><span class="value-large">${weatherData.sunset}</span></p>`;
}