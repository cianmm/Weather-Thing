/*global $:false, Select:false, Modernizr:false, moment:false*/

// setup Selects
Select.init();

var select1 = new Select({
    el: document.getElementById("locationSelectForm1")
  });

var select2 = new Select({
    el: document.getElementById("locationSelectForm2")
  });

select1.on("change", function(){
  getWeatherByCity(this.value, 1, buildWeather);
});
select2.on("change", function(){
  getWeatherByCity(this.value, 2, buildWeather);
});


// DOCUMENT READY STARTS HERE
$(document).ready(function(){
  // start by loading our standard Dublin and Paris
  loadDefaultLocs();
  get_location();
});

var loadDefaultLocs = function() {
  getWeatherByCity(2964574, 1, buildWeather);
  getWeatherByCity(2988507, 2, buildWeather);
};

// our location-grabbing code. Tests for existance of the location api using Modernizr, if doesn't exist falls back to some tasty defaults.
var get_location = function() {
  if (Modernizr.geolocation) {
    navigator.geolocation.getCurrentPosition(getWeatherByLatLon, noPermission);
  } else {
    // If there is no support, let's load Dublin and Paris. Everybody loves Dublin and Paris.
    loadDefaultLocs();
  }
};

function noPermission(err) {
  if (err.code === 1){
    //User didn't give permission, load Dublin and Paris.
    loadDefaultLocs();
  }
}

var getWeatherByLatLon = function(loc) {
  var url = "//api.openweathermap.org/data/2.5/weather?lat=" + loc.coords.latitude + "&lon=" + loc.coords.lonitude + "&units=metric";

  var returnData = {};

  $.getJSON(url, function(data){
    returnData.temp = data.main.temp;
    returnData.name = data.name;
    returnData.country = data.sys.country;
    returnData.main = data.weather[0].main;
    returnData.desc = toTitleCase(data.weather[0].description);
    returnData.dt = data.dt;
    returnData.id = data.id;

    buildWeather(returnData, 1);
    buildWeather(returnData, 2);

  });

};

var getWeatherByCity = function(id, form, callback) {
  var url = "//api.openweathermap.org/data/2.5/weather?id=" + id + "&units=metric";

  var returnData = {};

  $.getJSON(url, function(data){
    returnData.temp = data.main.temp;
    returnData.name = data.name;
    returnData.country = data.sys.country;
    returnData.main = data.weather[0].main;
    returnData.desc = toTitleCase(data.weather[0].description);
    returnData.dt = data.dt;
    returnData.id = data.id;

    // note to self you aren't going mad, data.dt is the time that the forecast was recieved not the time of the request
    callback(returnData, form);

  });

};


function buildWeather(weather, form) {
  var forecast = $('#forecast' + form);
  var conditions = forecast.find('.conditions');

  var time = moment(weather.dt*1000);

  forecast.find('.locationTitle').text(weather.name);

  // set conditions area
  conditions.find('.city').text(weather.name);
  conditions.find('.country').text(weather.country);
  conditions.find('.time').text(time.format("h:mm a"));

  // set degrees
  var degrees = weather.temp.toFixed(0);
  forecast.find('.temp').text(degrees);

  // set summary
  forecast.find('.desc').text(weather.desc);

  // set forecast link
  forecast.find('.fullForecast').attr("href", "http://openweathermap.org/city/" + weather.id);
}

// Stackoverflow to the rescue
function toTitleCase(str)
{
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
