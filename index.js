'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const routes = require('./routes/routes.js');

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(routes);

app.listen(3000, function () {
    console.log('server on port 3000')
});
