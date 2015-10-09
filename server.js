var express = require('express'),
    PORT = process.env.PORT || 3000,
    server = express();

server.get('/super-secret-test', function(req, res){
  res.write("Welcome to my amazing app");
  res.end();
});

server.listen(PORT, function(){
  console.log("SERVER IS UP ON PORT:", PORT);
})
