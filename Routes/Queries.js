var express = require('express');
var api = express.Router();
var database = require('../Database/database');
var cors = require('cors')
var jwt = require('jsonwebtoken');

var token;
const airTerms = { temperature: 'Lämpötila', humidity: 'Kosteus' };

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

        const sql = "SELECT asd.id, asd.device_id, s.sensor_name, UNIX_TIMESTAMP(asd.time) as time, asd.temperature, asd.humidity, s.description, s.temp_description, s.hum_description FROM sensors s "
  	              + "JOIN air_sensor_data asd ON s.id = asd.device_id "
  	              + "WHERE asd.device_id IN (SELECT DISTINCT asd.device_id FROM air_sensor_data asd ORDER BY asd.device_id ASC) AND "
                  + "(time BETWEEN '" + startDate + "' AND '" + endDate + "') "
  	              + "ORDER BY asd.device_id ASC, asd.time ASC";

        connection.query(sql, function(error, rows, fields) {
            if (!error) {
              if(!Object.keys(rows).length){
                appData = {};
                appData["error"] = 1;
                appData["data"] = "Not Found";
                res.status(404).json(appData);
              } else {

                const uniqueObjects = rows.map(e => e.temp_description)
                  .map((e, i, final) => final.indexOf(e) === i && i).filter(e => rows[e])
                  .map(e => [rows[e].temp_description, 'temperature'])
                  .concat(rows.map(e => e.temp_description)
                  .map((e, i, final) => final.indexOf(e) === i && i).filter(e => rows[e])
                  .map(e => [rows[e].hum_description, 'humidity']));

                const sensorData = [];
                uniqueObjects.map((description, index) => {
                  const data = rows.filter((x, i) => x.temp_description === description[0] || x.hum_description === description[0])
                  .map(item => [((item.time + 7200) * 1000), item[description[1]]]);

                  sensorData[index] = {
                    name: description[0],
                    data
                  }
                });

                res.status(200).json(sensorData);
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

const getChartDataobjectWithDeviceId = (rowData, description, type) => {

  let data = {};

    const dataArray = rowData.filter((x, i) => x.temp_description === description[0] || x.hum_description === description[0])
    .map(item => [((item.time + 7200) * 1000), item[description[1]]]);
    data = {
      data: dataArray,
      lineWidth: 2.5,
      type: type
    };

  return data;
};


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
        const sql = 'SELECT * FROM air_sensor_data WHERE id IN (SELECT MAX(id) AS id FROM air_sensor_data GROUP BY device_id)';
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


api.get('/get/test', function(req, res) {
  var appData = {};
  const { startDate, endDate } = req.query;

  database.connection.getConnection(function(err, connection) {
      if (err) {
          appData["error"] = 1;
          appData["data"] = "Internal Server Error";
          res.status(500).json(appData);
      } else {

        const sql = "SELECT asd.id, asd.device_id, s.sensor_name, UNIX_TIMESTAMP(asd.time) as time, asd.temperature, asd.humidity FROM sensors s "
		              + "JOIN air_sensor_data asd ON s.id = asd.device_id "
		              + "WHERE asd.device_id IN (SELECT DISTINCT asd.device_id FROM air_sensor_data asd ORDER BY asd.device_id ASC) AND "
                  + "(time BETWEEN '" + startDate + "' AND '" + endDate + "') "
		              + "ORDER BY asd.device_id ASC, asd.time ASC";

        connection.query(sql, function(error, rows, fields) {
            if (!error) {
              if(!Object.keys(rows).length) {
                appData["error"] = 1;
                appData["data"] = "Not Found";
                res.status(404).json(appData);
              } else {

                const keys = [...(new Set(rows.map((rows) => rows.device_id)))];
                const test = keys.map((y, i) => rows.filter(x => x.device_id === y).map(x => x));
                console.log(test);

                appData["data"] = rows;
                res.status(200).json(test);
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
