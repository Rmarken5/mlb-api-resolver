var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*");

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
    next();
});
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());

var routes = require('./baseball/baseballRoute');
routes(app);


app.listen(3000, () => {
    console.log('Server is running on port 3000.');
});