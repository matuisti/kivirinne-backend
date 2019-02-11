var express = require('express');
var api = express.Router();
var database = require('../Database/database');
var cors = require('cors')
var jwt = require('jsonwebtoken');
var token;

api.use(cors());

process.env.SECRET_KEY = "devesh";

api.use(function(req, res, next) {
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

/*
  Returns all sensor data from the specified time interval
  param [ interval : integer value ] description [ time parameter ]
  param [ intervalformat : string value ] description [ time format example WEEK or DAY ]
*/
api.get('/get/sensorDataBetweenTwoDays', function(req, res) {
  const { startDate, endDate, deviceId } = req.query;

  var appData = [];
  database.connection.getConnection(function(err, connection) {
      if (err) {
          appData["error"] = 1;
          appData["data"] = "Internal Server Error";
          res.status(500).json(appData);
      } else {

        var sql = "SELECT asd.id, asd.device_id, UNIX_TIMESTAMP(asd.time) as time, asd.temperature, asd.humidity, asd.voltage, asd.awake_time "
  		          + "FROM air_sensor_data asd JOIN sensors s ON s.id = asd.device_id "
  		          + "WHERE (time BETWEEN '" + startDate + "' AND '" + endDate + "') AND asd.device_id = " + deviceId;

        connection.query(sql, function(error, rows, fields) {
            if (!error) {
              if(!Object.keys(rows).length){
                appData = {};
                appData["error"] = 1;
                appData["data"] = "Not Found";
                res.status(404).json(appData);
              } else {
              rows.map(function(key, index) {
                appData.push({
                  id: rows[index].id,
                  deviceId: rows[index].device_id,
                  time: rows[index].time,
                  airData: {
                    temperature: rows[index].temperature,
                    humidity: rows[index].humidity
                  },
                  voltage: rows[index].voltage,
                  awakeTime: rows[index].awake_time
                })
              });
              res.status(200).json(appData);
            }
            } else {
                appData["data"] = error;
                res.status(400).json(appData);
            }
        });
        connection.release();
      }
  });
});


/*
  Returns all sensor data from the specified time interval
  param [ interval : integer value ] description [ time parameter ]
  param [ intervalformat : string value ] description [ time format example WEEK or DAY ]
*/
api.get('/get/dht', function(req, res) {
  const { interval, intervalformat } = req.query;

  var appData = [];
  database.connection.getConnection(function(err, connection) {
      if (err) {
          appData["error"] = 1;
          appData["data"] = "Internal Server Error";
          res.status(500).json(appData);
      } else {
        var sql = 'SELECT id, device_id, UNIX_TIMESTAMP(time) as time, temperature, humidity, voltage, awake_time FROM air_sensor_data WHERE '
                + 'time BETWEEN timestamp(DATE_SUB(NOW(), INTERVAL ' + interval + ' ' + intervalformat + ')) AND timestamp(NOW())';

        connection.query(sql, function(error, rows, fields) {
            if (!error) {
              if(!Object.keys(rows).length){
                appData = {};
                appData["error"] = 1;
                appData["data"] = "Not Found";
                res.status(404).json(appData);
              } else {
              rows.map(function(key, index) {
                appData.push({
                  id: rows[index].id,
                  deviceId: rows[index].device_id,
                  time: rows[index].time,
                  airData: {
                    temperature: rows[index].temperature,
                    humidity: rows[index].humidity
                  },
                  voltage: rows[index].voltage,
                  awakeTime: rows[index].awake_time
                })
              });
              res.status(200).json(appData);
            }
            } else {
                appData["data"] = error;
                res.status(400).json(appData);
            }
        });
        connection.release();
      }
  });
});

/*
  Returns all sensors last measurement data
*/
api.get('/get/currentsensordata', function(req, res) {
  var appData = {};

  database.connection.getConnection(function(err, connection) {
      if (err) {
          appData["error"] = 1;
          appData["data"] = "Internal Server Error";
          res.status(500).json(appData);
      } else {
        var sql = 'SELECT * FROM air_sensor_data WHERE id IN (SELECT MAX(id) AS id FROM air_sensor_data GROUP BY device_id)';
        connection.query(sql, function(error, rows, fields) {
            if (!error) {
              if(!Object.keys(rows).length) {
                appData["error"] = 1;
                appData["data"] = "Not Found";
                res.status(404).json(appData);
              } else {
                appData["data"] = rows;
                res.status(200).json(appData);
              }
            } else {
              appData["data"] = error;
              res.status(400).json(appData);
            }
        });
        connection.release();
      }
  });
});

module.exports = api;
