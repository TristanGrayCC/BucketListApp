/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var AllCountries = __webpack_require__(2);

var app = function() {
  new AllCountries();
}

window.addEventListener('load', app);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var MapWrapper = __webpack_require__(4);

var AllCountries = function() {
  this.app();
  this.showList();
  var map = document.getElementById("main-map");
  var center = {lat: 0, lng: 0};
  this.mainMap = new MapWrapper(map, center, 1);
  var button = document.getElementById("addButton");
  button.addEventListener('click', this.addToAPI.bind(this));
};

AllCountries.prototype = {

  showList: function(){
    var url = "http://localhost:3000/api/countries"
    this.makeRequest(url, this.populateBucketList.bind(this));
  },

  populateBucketList: function(countries){
    var list = document.getElementById("API-list");
    for (country of countries){
      var listItem = document.createElement("li");
      listItem.innerText = country.name;
      list.appendChild(listItem);
    }
    for (country of countries){
      var center = {lat: country.latlng[0], lng:country.latlng[1]};
      this.mainMap.addMarker(center);
    }
  },

  app: function(){
    var url = "https://restcountries.eu/rest/v2"
    this.makeRequest(url, this.populateList.bind(this));
    var list = document.getElementById("country-list");
    var dropDown = document.getElementById("drop-down");
    dropDown.addEventListener('change', this.display.bind(this));
  },

  populateList: function(countries){
    var dropDown = document.getElementById("drop-down");
    for (country of countries){
      var listItem = document.createElement("option");
      listItem.innerText = country.name;
      listItem.value = country.name;
      dropDown.appendChild(listItem);
    }
  },

  makeRequest: function(url, callback){
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.addEventListener("load", function(){
      if(request.status !== 200) return;
      var jsonString = request.responseText;
      var results = JSON.parse(jsonString);
      callback(results);
    });
    request.send();
  },

  display: function(){
    var selected = document.getElementById("drop-down").value;
    var url = "https://restcountries.eu/rest/v2/name/" + selected;
    this.makeRequest(url, function(country){
      var jsonString = JSON.stringify(country);
      localStorage.setItem('country', jsonString);

      var list = document.getElementById("country-list");
      var listItem = document.createElement("li")
      listItem.innerText = country[0].name
      listItem.id = "country-name"
      list.appendChild(listItem);
    });
  },

  addToAPI: function(){
    var country = document.getElementById("country-name").innerText;
    var url = "https://restcountries.eu/rest/v2/name/" + country;
    this.makeRequest(url, function(results){
      console.log(results[0].latlng);
      var insertlatlng = results[0].latlng;
      var countryObject = {name: country, latlng: insertlatlng};
      var countryParsed = JSON.stringify(countryObject);
      var request = new XMLHttpRequest();
      request.open("POST", 'http://localhost:3000/api/countries');
      request.setRequestHeader('Content-Type', 'application/json');
      request.addEventListener('load', function() {
        if(request.status !== 200) return;
        var jsonString = request.responseText;
        var resultsObject = JSON.parse(jsonString);
      });
      request.send(countryParsed);
      location.reload();
    });
  }

}

module.exports = AllCountries;

/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, exports) {

var MapWrapper = function(container, coords, zoom){
  this.googleMap = new google.maps.Map(container, {
    center: coords,
    zoom: zoom
  });  
}

MapWrapper.prototype = {
  addMarker: function(coords){
    var marker = new google.maps.Marker({
      position: coords,
      map: this.googleMap,
      animation: google.maps.Animation.DROP
    });
    return marker;
  }
}

module.exports = MapWrapper;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map