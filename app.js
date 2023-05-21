
const express = require('express');
const morgan = require('morgan');
const App = require('express')();
const path = require('path');
var cors = require('cors')
const helmet = require("helmet");
var toobusy = require('toobusy-js');

App.use(express.json());
App.use(morgan('dev'));
App.use(cors())

App.use(helmet());

toobusy.maxLag(10);
toobusy.interval(250);

App.use(function (req, res, next) {
     if (toobusy()) {
          res.send(503, "I'm busy right now, sorry.");
     } else {
          next();
     }
});


App.use(express.urlencoded({ extended: true, limit: "1kb" }));
App.use(express.json({ limit: "1kb" }));



const userRoutes = require('./routes/userRoutes.js');
const productsRoutes = require('./routes/productRoutes.js');


// Serving static files
App.use(express.static(path.join(__dirname, 'public')));

App.use('/api/users', userRoutes);
App.use('/api/products', productsRoutes);






module.exports = App;



