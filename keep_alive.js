var http=require('http');

http.createServer(function (req, res) {
  res.write("Photron says you, HELLO!");
  res.end();
}).listen(8080);
