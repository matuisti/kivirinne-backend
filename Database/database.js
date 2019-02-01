var mysql = require('mysql');

var connection = mysql.createPool({
    connectionLimit: 100,
    host:'localhost',
    user:'root',
    password:'',
    database:'cottagedb',
    port: 3306,
    debug: false,
    multipleStatements: true,
    dateStrings: true,
});

module.exports.connection = connection;

// var connection = mysql.createPool({
//     connectionLimit: 100,
//     host:'localhost',
//     user:'phpmyadmin',
//     password:'matula',
//     database:'cottagedb',
//     port: 3306,
//     debug: false,
//     multipleStatements: true,
//     dateStrings: true,
// });
