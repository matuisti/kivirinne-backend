var express = require('express');
var insert = express.Router();
var database = require('../Database/database');
var moment = require('moment');
var cors = require('cors');

insert.use(cors());

insert.get('/dht', function(req, res) {

    var appData = {};
    const { device_id, temperature, humidity, voltage, awake_time } = req.query;
    var timestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    console.log(timestamp);

    var post = {
      device_id: device_id,
      time: timestamp,
      temperature: temperature,
      humidity: humidity,
      voltage: voltage,
      awake_time: awake_time,
    };

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
          connection.query('INSERT INTO air_sensor_data SET ?', post, function(error, result) {
            if (error) {
              res.status(400).json(error);
            } else {
              res.status(200).json(result);
            }
          });
          connection.release();
        }
    });
});


insert.get('/get/dht', function(req, res) {

  const { interval, intervalformat } = req.query;

	// SELECT * FROM `raw_air_data` WHERE `time` BETWEEN DATE_SUB("2018-10-29 16:00 :00", INTERVAL 10 MINUTE ) AND timestamp(NOW())
  var appData = [];
  database.connection.getConnection(function(err, connection) {
      if (err) {
          appData["error"] = 1;
          appData["data"] = "Internal Server Error";
          res.status(500).json(appData);
      } else {
        	var sql = 'SELECT id, device_id, UNIX_TIMESTAMP(time) as time, temperature, humidity, voltage, awake_time FROM air_sensor_data WHERE time BETWEEN timestamp(DATE_SUB(NOW(), INTERVAL ' + interval + ' ' + intervalformat + ')) AND timestamp(NOW())';
          connection.query(sql, function(error, rows, fields) {
            if (!error) {
              rows.map(function(key, index) {
                appData.push({
                  id: rows[index].id,
                  deviceId: rows[index].divice_id,
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
            } else {
              appData["data"] = error;
              res.status(400).json(appData);
            }
          });
          connection.release();
      }
  });
});

module.exports = insert;
