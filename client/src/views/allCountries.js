var MapWrapper = require('./mapWrapper.js');

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