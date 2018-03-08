/*const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'sql12.freemysqlhosting.net',
  port:3306,
  user: 'sql12217753',
  password: 'RVEJrhi9Tn',
  database: 'sql12217753',
  acquireTimeout: 1000000

  /*host: 'localhost',
  port:3306,
  user: 'root',
  password: '',
  database: 'iebproject'

});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});
var http = require("http");  
http.createServer(function (request, response) {  
 // Send the HTTP header   
   // HTTP Status: 200 : OK  
   // Content Type: text/plain  
   response.writeHead(200, {'Content-Type': 'text/plain'});  
   // Send the response body as "Hello World"  
   response.end('Hello World\n');  
}).listen(8081);  
// Console will print the message  
console.log('Server running at http://127.0.0.1:8081/');  
*/

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars  = require('express-handlebars'), hbs;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!",resave: true,saveUninitialized: true}));
 bodyParser = require('body-parser'),
  app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', 1337);
app.set('views', path.join(__dirname, '/views'));
app.use(express.static('public')); 
/* express-handlebars - https://github.com/ericf/express-handlebars
A Handlebars view engine for Express. */
hbs = handlebars.create({
   defaultLayout: 'main'
});
 
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
 
//app.use(express.static(path.join(__dirname, 'static')));



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
require('./routes')(app);

