const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const formidable = require('express-formidable');
const crypto = require('crypto');
const apiActions = require('./apiActions.js');
const app = express();

const port = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index.html');
});

app.post('/api/query', 
  formidable(),
  apiActions.imagePresentAndValid,
  apiActions.imageToBase64,
  apiActions.queryKairos,
  apiActions.craftResponse
);

// --------- HOT RELOAD STUFF FOR DEV MODE -------
if (process.env.NODE_ENV === 'production') {
  console.log('\x1b[33m%s\x1b[0m', 'Running in production mode');
  app.use('/static', express.static(__dirname + '/static'));
} else {
  // When not in production, enable hot reloading
  var chokidar = require('chokidar');
  var webpack = require('webpack');
  var webpackConfig = require('./webpack.config.dev');
  var compiler = webpack(webpackConfig);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));
  app.use(require('webpack-hot-middleware')(compiler));
  // Do "hot-reloading" of express stuff on the server
  // Throw away cached modules and re-require next time
  // Ensure there's no important state in there!
  var watcher = chokidar.watch('./server');
  watcher.on('ready', function() {
    watcher.on('all', function() {
      console.log('Clearing /server/ module cache from server');
      Object.keys(require.cache).forEach(function(id) {
        if (/\/server\//.test(id)) delete require.cache[id];
      });
    });
  });
}

app.listen(port, 'localhost', function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('\x1b[32m%s\x1b[0m', 'Kairos query service is now available on port: ' + port);
});