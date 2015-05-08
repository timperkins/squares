var http = require('http'),
	express = require('express'),
	path = require('path'),
	config = {
	  listenPort: 3000,
	  distFolder: path.resolve(__dirname, '../client'),
	  serverFolder: path.resolve(__dirname),
	  staticUrl: '/static',
	},
	app = express(),
	bodyParser = require('body-parser'),
	server = http.createServer(app),
	buildFolder = path.resolve(__dirname, '../client');

app.use(bodyParser.json()); 

// a middleware with no mount path; gets executed for every request to the app
app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});


app.use('/static/', express.static(buildFolder));

app.get('/quiz', function(req, res) {
  res.sendFile('./mock-data/all.json', {root: config.serverFolder});
});

app.get('/quiz/:id', function(req, res) {
	var id = req.params.id;
  res.sendFile('./mock-data/' + id + '.json', {root: config.serverFolder});
});

app.all('/*', function(req, res) {
  // Just send the index.html for other files to support HTML5Mode
  res.sendFile('index.html', { root: config.distFolder });
});

// Start up the server on the port specified in the config
server.listen(config.listenPort, '0.0.0.0', 511, function() {
  
});
console.log('Listening on port: ' + config.listenPort);
