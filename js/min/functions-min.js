function noPermission(e){1===e.code&&loadDefaultLocs()}function buildWeather(e,t){var n=$("#forecast"+t),o=n.find(".conditions"),a=moment(1e3*e.dt);n.find(".locationTitle").text(e.name),o.find(".city").text(e.name),o.find(".country").text(e.country),o.find(".time").text(a.format("h:mm a"));var i=e.temp.toFixed(0);n.find(".temp").text(i),n.find(".desc").text(e.desc),n.find(".fullForecast").attr("href","http://openweathermap.org/city/"+e.id)}function toTitleCase(e){return e.replace(/\w\S*/g,function(e){return e.charAt(0).toUpperCase()+e.substr(1).toLowerCase()})}Select.init();var select1=new Select({el:document.getElementById("locationSelectForm1")}),select2=new Select({el:document.getElementById("locationSelectForm2")});$(document).ready(function(){console.log("loadDefaults"),loadDefaultLocs(),get_location(),$("#locationSelectForm1").on("change blur",function(){getWeatherByCity(this.value,1,buildWeather)}),$("#locationSelectForm2").on("change blur",function(){getWeatherByCity(this.value,2,buildWeather)})});var loadDefaultLocs=function(){getWeatherByCity(2964574,1,buildWeather),getWeatherByCity(2988507,2,buildWeather)},get_location=function(){Modernizr.geolocation?navigator.geolocation.getCurrentPosition(getWeatherByLatLon,noPermission):loadDefaultLocs()},getWeatherByLatLon=function(e){var t="//api.openweathermap.org/data/2.5/weather?lat="+e.coords.latitude+"&lon="+e.coords.lonitude+"&units=metric",n={};$.getJSON(t,function(e){n.temp=e.main.temp,n.name=e.name,n.country=e.sys.country,n.main=e.weather[0].main,n.desc=toTitleCase(e.weather[0].description),n.dt=e.dt,n.id=e.id,buildWeather(n,1),buildWeather(n,2)})},getWeatherByCity=function(e,t,n){var o="//api.openweathermap.org/data/2.5/weather?id="+e+"&units=metric",a={};$.getJSON(o,function(e){a.temp=e.main.temp,a.name=e.name,a.country=e.sys.country,a.main=e.weather[0].main,a.desc=toTitleCase(e.weather[0].description),a.dt=e.dt,a.id=e.id,n(a,t)})};