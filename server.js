var express = require('express');
var cors = require('cors');
var bodyParser = require("body-parser");
var app = express();
var Users = require('./Routes/Users');
var Queries = require('./Routes/Queries');
var InsertData = require('./Routes/InsertData');

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/users', Users);
app.use('/api', Queries);
app.use('/insert', InsertData);

var port = process.env.PORT || 8080;
app.listen(port,function(){
    console.log("Server is running on port: " + port);
});
