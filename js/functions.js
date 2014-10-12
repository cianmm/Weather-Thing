$(document).ready(function(){


});


var getWeatherByLatLon = function(lat, lon, form, callback) {

  var url = "//api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric";

  var returnData = {};

  $.getJSON(url, function(data){
    returnData.temp = data.main.temp;
    returnData.name = data.name;
    returnData.country = data.sys.country;
    returnData.main = data.weather[0].main;
    returnData.desc = data.weather[0].description;

    callback(returnData, form);

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
    returnData.desc = data.weather[0].description;
    returnData.dt = data.dt;

    // note to self you aren't going mad, data.dt is the time that the forecast was recieved not the time of the request
    callback(returnData, form);

  });

};


function buildWeather(weather, form) {
  var forecast = $('#forecast' + form);
  var conditions = forecast.find('.conditions');

  var time = moment(weather.dt*1000);

  console.log(time.format("h:mm a"));

  forecast.find('.locationTitle').text(weather.name);

  // set conditions area
  conditions.find('.city').text(weather.name);
  conditions.find('.country').text(weather.country);
  conditions.find('.time').text(time.format("h:mm a"));

  // set degrees
  var degrees = weather.temp.toFixed(0);
  forecast.find('.temp').text(degrees);
}
