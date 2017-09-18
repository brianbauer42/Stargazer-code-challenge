const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const formidable = require('express-formidable');
const crypto = require('crypto');
const imageActions = require('./imageActions.js');

const sessionSecret = crypto.randomBytes(64).toString('hex');
const port = 8080;

app.use(session({
  secret: sessionSecret,
  saveUninitialized: true,
  resave: true
}));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
//app.use('/uploads', express.static("./uploads"));

app.get('/', function(req, res){
  res.render('index.html');
});

app.post('/api/upload', imageActions.verifyPresence, imageActions.queryKairos, imageActions.sendUserResponse);

app.listen(port, 'localhost', function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('\x1b[32m%s\x1b[0m', 'Kairos query service is now available on port: ' + port);
});