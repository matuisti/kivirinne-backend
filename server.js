var express = require('express');
var cors = require('cors');
var bodyParser = require("body-parser");
var app = express();
var router = express.Router();
var Users = require('./Routes/Users');
var Queries = require('./Routes/Queries');
var InsertData = require('./Routes/InsertData');
var Sensors = require('./Routes/Sensors');

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/api', router);
router.use('/devicedata', Queries);
router.use('/insert', InsertData);
router.use('/users', Users);
router.use('/sensors', Sensors);

// app.use('/api/insert', InsertData);
// app.use('/api/users', Users);
// app.use('/api/sensors', Sensors);

var port = process.env.PORT || 8080;
app.listen(port,function(){
    console.log("Server is running on port: " + port);
});
