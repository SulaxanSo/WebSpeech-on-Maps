var fs = require('fs');
//var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('certificates/server.key', 'utf8');
var certificate = fs.readFileSync('certificates/server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

app.use(express.static('public'));
// your express configuration here

//var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

/*httpServer.listen(8080, function(){
  console.log("Serving on Port 8080")
});*/
httpsServer.listen(8443, function(){
  console.log("Listening at 'https://localhost:8443'")
});