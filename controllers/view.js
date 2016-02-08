
var fs   = require('fs');
var Foxx = require("org/arangodb/foxx");
var controller = new Foxx.Controller(applicationContext);

controller.get('/*', function (req, res) {

  var filePath = applicationContext.basePath + '/public/' + req.suffix.join('/');

  if(fs.isFile(filePath))
    res.sendFile(filePath);
  else
    res.sendFile(applicationContext.basePath + '/public/index.html');
});
