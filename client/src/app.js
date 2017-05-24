var AllCountries = require('./views/allCountries');

var app = function() {
  new AllCountries();
}

window.addEventListener('load', app);