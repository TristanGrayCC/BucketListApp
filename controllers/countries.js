var express = require('express');
var app = express();
var countryRouter = express.Router();

var CountryQuery = require('../db/countryQuery');
var query = new CountryQuery();

//country index
countryRouter.get('/', function(req, res) {
  query.all(function(countries) {
    res.json(countries);
  });
});

//add new country
countryRouter.post('/', function(req, res) {
  var country = {
    name: req.body.name
  }
  query.add(country, function(results) {
    res.json(results);
  })
});


module.exports = countryRouter;