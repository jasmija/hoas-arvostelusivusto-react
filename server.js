// Modules to use
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv');
const cookieParser = require('cookie-parser');

// Set path to ".env"-file for variable "dotenv"
require('dotenv').config();

// Add database connection details to variable "connection"
const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

const util = require('util');
const query = util.promisify(connection.query).bind(connection);
const app = express();

// Use handlebars
app.set('view engine', 'hbs');

// Listen to port 3000
//app.listen(3000, () => console.log('Listening at port 3000'));
var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});

// Needed for css and images to work
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/js', express.static(path.join(__dirname, 'js')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

// Define routes
//app.use('/', require('./routes/pages'));
//app.use('/', require('./routes/auth'));

const url = require('url');

/**
 * Send SQL query to database to get reviews where id = desired apartment id
 */
app.get('/api/results', function(req, res) {
  const q = url.parse(req.url, true).query;
  const id = q.id;
  let string;

  const sql = 'SELECT apartments.address, reviews.id, reviews.shape, reviews.comfort, reviews.grade, reviews.free_word'
      + ' FROM apartments, reviews'
      + ' WHERE reviews.id = apartments.id'
      + ' and apartments.id= ?';

  (async () => {
    try {
      const rows = await query(sql, [id]);
      string = JSON.stringify(rows);
      res.send(string);
    } catch (err) {
      console.log('Database error!' + err);
    }
  })();
});

/**
 * Get apartment address and id from database where id = desired apartment id
 */
app.get('/api/address', function(req, res) {
  const q = url.parse(req.url, true).query;
  const id = q.id;
  let string;

  const sql = 'SELECT apartments.address, apartments.id'
      + ' FROM apartments'
      + ' WHERE apartments.id= ?';

  (async () => {
    try {
      const rows = await query(sql, [id]);
      string = JSON.stringify(rows);
      res.send(string);
    } catch (err) {
      console.log('Database error!' + err);
    }
  })();
});

/**
 * Get apartment id and name from database
 */
app.get('/api/apartments', function(req, res) {
  const q = url.parse(req.url, true).query;
  let string;

  const sql = 'SELECT id, address'
      + ' FROM apartments';

  (async () => {
    try {
      const rows = await query(sql);
      string = JSON.stringify(rows);
      res.send(string);
    } catch (err) {
      console.log('Database error!' + err);
    }
  })();
});

/**
 * Get chat topic id, username and header from database
 */
app.get('/api/chat', function(req, res) {
  const q = url.parse(req.url, true).query;
  let string;

  const sql = 'SELECT id, username, header'
      + ' FROM chat';

  (async () => {
    try {
      const rows = await query(sql);
      string = JSON.stringify(rows);
      res.send(string);
    } catch (err) {
      console.log('Database error!' + err);
    }
  })();
});

/**
 * Get a header with a specific id from database
 */
app.get('/api/chatheader', function(req, res) {
  const q = url.parse(req.url, true).query;
  const id = q.id;
  let string;

  const sql = 'SELECT header'
      + ' FROM chat'
      + ' WHERE id=?';

  (async () => {
    try {
      const rows = await query(sql, [id]);
      string = JSON.stringify(rows);
      res.send(string);
    } catch (err) {
      console.log('Database error!' + err);
    }
  })();
});

/**
 * Get chat contents of a specific chat where id = desired chat id
 */
app.get('/api/chatcontent', function(req, res) {
  const q = url.parse(req.url, true).query;
  const id = q.id;
  let string;

  const sql = 'SELECT answer'
      + ' FROM chat_answers'
      + ' WHERE id_chat=?';

  (async () => {
    try {
      const rows = await query(sql, [id]);
      string = JSON.stringify(rows);
      res.send(string);
    } catch (err) {
      console.log('Database error!' + err);
    }
  })();
});

//Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({extended: true});
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/**
 * Insert new chat to database
 */
app.post('/api/addchat', urlencodedParser, function(req, res) {

  let json = req.body;

  let chatti = JSON.stringify(json);
  res.send('POST succesful: ' + chatti);

  const sql = 'INSERT INTO chat (username, header) VALUES ( ?, ?)';

  (async () => {
    try {
      const result = await query(sql, [json.username, json.header]);
      let insertedId = result.insertId;
      res.send('POST succesful: ' + req.body);
    } catch (err) {
      console.log('Insertion into tables was unsuccessful!' + err);
    }
  })();
});

/**
 * Insert chat answer to database
 */
app.post('/api/addchatanswer', urlencodedParser, function(req, res) {

  let json = req.body;

  let chattianswer = JSON.stringify(json);
  res.send('POST succesful chat: ' + chattianswer);

  const sql = 'INSERT INTO chat_answers (id_chat, answer) VALUES ( ?, ?)';

  (async () => {
    try {
      const result = await query(sql, [json.id_chat, json.answer]);
      let insertedId = result.insertId;
    } catch (err) {
      console.log('Insertion into tables was unsuccessful!' + err);
    }
  })();
});

/**
 * Insert apartment reviews to database
 */
app.post('/api/sendform', urlencodedParser, function(req, res) {

  console.log("body: %j", req.body);
  let jsonObj = req.body;
  const sql = 'INSERT INTO reviews (id, shape, comfort, grade, free_word) VALUES ( ?, ?, ?, ?, ?)';
  console.log("jsonObject: " + jsonObj.name + ", " + jsonObj.shape + ", " + jsonObj.comfort + ", " + jsonObj.grade + ", " + jsonObj.word);

  (async () => {
    try {
      const result = await query(sql, [
        jsonObj.name,
        jsonObj.shape,
        jsonObj.comfort,
        jsonObj.grade,
        jsonObj.word]);
      let insertedId = result.insertId;
      //res.send('POST succesful: ' + req.body);
      res.status(200).send("POST succesful " + req.body);
    } catch (err) {
      console.log('Insertion into tables was unsuccessful! ' + err);
    }
  })();
});
