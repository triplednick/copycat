'use strict';

const express = require('express'),
  bodyParser = require('body-parser'),
  path = require('path');

const app = express();

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json()); //Use body parser middleware to populate body of request
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public' + '/index.html'))
});

app.listen(8080);