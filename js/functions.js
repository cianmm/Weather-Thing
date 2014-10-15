/*global $:false, Select:false, Modernizr:false, moment:false*/

// setup Selects
Select.init();

var select1 = new Select({
    el: document.getElementById("locationSelectForm1")
  });

var select2 = new Select({
    el: document.getElementById("locationSelectForm2")
  });


// DOCUMENT READY STARTS HERE
$(document).ready(function(){
  // start by loading our standard Dublin and Paris
  console.log("loadDefaults");
  loadDefaultLocs();
  get_location();

  $('#locationSelectForm1').on("change blur", function(){
    getWeatherByCity(this.value, 1, buildWeather);
  });
  $('#locationSelectForm2').on("change blur", function(){
    getWeatherByCity(this.value, 2, buildWeather);
  });

});

var loadDefaultLocs = function() {
  getWeatherByCity(2964574, 1, buildWeather);
  getWeatherByCity(2988507, 2, buildWeather);
};

// our location-grabbing code. Tests for existance of the location api using Modernizr, if doesn't exist falls back to some tasty defaults.
var get_location = function() {
  console.log("asking for location");
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
    returnData.weatherid = data.weather[0].id;

    // note to self you aren't going mad, data.dt is the time that the forecast was recieved not the time of the request
    callback(returnData, form);

  });

};


function buildWeather(weather, form) {
  var forecast = $('#forecast' + form);
  var conditions = forecast.find('.conditions');

  var time = moment(weather.dt*1000);

  // decide on the background to use
  var weatherid = parseInt(weather.weatherid);
  var img;
  var newcolor;

  console.log(weatherid);

    // originaly tried a switch here. I must be super tired, cause it didn't do anything.

    if (weatherid < 233) {
      img = "storm.jpg"; //Thunderstorm (not really relevent image)
      newcolor = "rgba(52, 73, 94,1.0)";
    } else if (weatherid > 232 && weatherid < 322) {
      img = "rain.jpg";// light rain
      newcolor = "rgba(52, 152, 219,1.0)";
    }  else if (weatherid > 322 && weatherid < 530) {
      img = "heavyrain.jpg";
      newcolor = "rgba(41, 128, 185,1.0)";
    } else if (weatherid >= 600 && weatherid <= 622) {
      img = "snow.jpg";
      newcolor = "rgba(127, 140, 141,1.0)";
    } else if (weatherid >= 701 && weatherid <= 781) {
      img = "lonelytree.jpg"; // completely arbitrary at this stage
      newcolor = "rgba(241, 196, 15,1.0)";
    } else if (weatherid >= 800 && weatherid <= 804) {
      img = "valencia.jpg";
      newcolor = "rgba(22, 160, 133,1.0)";
    } else {
      img = "valley.jpg";
    }

  console.log(img);
  // set background (may as well let it load while we do the rest)
  forecast.fadeTo("fast", 0, function(){
    $(this).css("background-image", "url(/images/" + img + ")")

    $(this).find('.locationTitle').text(weather.name).css("color", newcolor);
    // set conditions area
    conditions.find('.city').text(weather.name);
    conditions.find('.country').text(weather.country);
    conditions.find('.time').text(time.format("h:mm a"));

    // set degrees
    var degrees = weather.temp.toFixed(0);
    $(this).find('.temp').text(degrees);

    // set summary
    $(this).find('.desc').text(weather.desc);

    // set forecast link
    $('.fullForecast a').attr("href", "http://openweathermap.org/city/" + weather.id);

    // set new colors
    $( this ).find('.bottomBar, .select-target b').css("background-color", newcolor);

    $(this).fadeTo("fast", 1);
  });


}

// Stackoverflow to the rescue
function toTitleCase(str)
{
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
