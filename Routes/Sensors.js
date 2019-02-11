var express = require('express');
var users = express.Router();
var database = require('../Database/database');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var token;

users.use(cors());
process.env.SECRET_KEY = "devesh";

users.post('/create', function(req, res) {
  var today = new Date();
  var appData = {
    "error": 1,
    "data": ""
  };

  database.connection.getConnection(function(err, connection) {
    if (err) {
      console.log(err);
      appData["error"] = 1;
      appData["data"] = "Internal Server Error";
      res.status(500).json(appData);
    } else {
      connection.query('SELECT * FROM sensors WHERE sensor_name = ?', req.body.sensor_name, function(err, rows, fields) {
        if (!rows.length && !err) {
          console.log(err);
          bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            var sensorData = {
              "sensor_name": req.body.sensor_name,
              "password": hash,
              "description": req.body.description,
              "created": today
            }
            connection.query('INSERT INTO sensors SET ?', sensorData, function(err, rows, fields) {
              if (!err) {
                appData.error = 0;
                appData["data"] = "Sensor registered successfully!";
                res.status(200).json(appData);
              } else {
                appData["data"] = "Error Occured!";
                res.status(400).json(appData);
              }
            });
          });
          } else {
            appData["data"] = "Sensor already exists!";
            res.status(409).json(appData);
          }
        });
      connection.release();
    }
  });
});


users.use(function(req, res, next) {
  var token = req.body.token || req.headers['token'];
  var appData = {};
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, function(err) {
      if (err) {
        appData["error"] = 1;
        appData["data"] = "Token is invalid";
        res.status(500).json(appData);
      } else {
        next();
      }
    });
  } else {
    appData["error"] = 1;
    appData["data"] = "Please send a token";
    res.status(403).json(appData);
  }
});

module.exports = users;
