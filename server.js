// Modules to use
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const url = require('url');
require('dotenv');

const secrets = require('./config/secrets');

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

// Listen to port 8080
const server = app.listen(8080, function() {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

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
      console.log('Database error! api/address' + err);
    }
  })();
});

/**
 * Get apartment id and name from database
 */
app.get('/api/apartments', function(req, res) {
  const q = url.parse(req.url, true).query;
  let string;

  const sql = 'SELECT id, address, image FROM apartments';

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

  console.log('body: %j', req.body);
  let jsonObj = req.body;
  const sql = 'INSERT INTO reviews (id, shape, comfort, grade, free_word) VALUES ( ?, ?, ?, ?, ?)';
  console.log('jsonObject: ' + jsonObj.id + ', ' + jsonObj.name + ', ' + jsonObj.shape + ', ' +
      jsonObj.comfort + ', ' + jsonObj.grade + ', ' + jsonObj.word);

  (async () => {
    try {
      const result = await query(sql, [
        jsonObj.id,
        jsonObj.shape,
        jsonObj.comfort,
        jsonObj.grade,
        jsonObj.word]);
      let insertedId = result.insertId;
      //res.send('POST succesful: ' + req.body);
      res.status(200).send('POST succesful ' + req.body);
    } catch (err) {
      console.log('Insertion into tables was unsuccessful! ' + err);
    }
  })();
});

/**
 * Add new user to database and hash password
 */
app.post('/api/adduser', urlencodedParser, function(req, res) {
  const username = req.body.username;
  let pwd = req.body.password;

  (async () => {
    try {
      const hashedPassword = await bcrypt.hash(pwd, 10);

      let sql = 'SELECT * FROM accounts WHERE username = ?';

      let result = await query(sql, [username]);
      if (result.length === 0) {
        pwd = hashedPassword;
        console.log('Hashed password: ' + pwd);

        sql = 'INSERT INTO accounts (username, password) VALUES (?, ?)';

        await query(sql, [username, pwd]);
        res.status(201).send();
        console.log('\nUser added!');
        console.log('User: ' + username + ', password: ' + pwd);
      } else {
        res.status(202).send();
        console.log('User already registered (user: "' + username + '" ).');
      }
    } catch (error) {
      console.log('ERROR! ' + error);
    }
  })();
});

/**
 * User login.
 */
app.post('/login', urlencodedParser, function(req, res) {
  const username = req.body.username;
  let pwd = req.body.password;

  (async () => {
    try {
      const hashedPassword = await bcrypt.hash(pwd, 10);

      let sql = 'SELECT * FROM accounts WHERE username = ?';

      let result = await query(sql, [username]);
      if (result.length === 0) {
        res.status(202).send('User not found.');
        console.log('\nUser not found!');
      }
      if (!result || !(await bcrypt.compare(pwd, result[0].password))) {
        res.status(203).send('User or password wrong.');
        console.log('\nUser or password wrong.');
      } else {
        let foundHashed = (result[0].password).toString();
        const match = await bcrypt.compare(pwd, result[0].password);
        if (match) {
          console.log('Login ok.');

          let user = {
            username: req.body.username,
            password: foundHashed,
          };
          const accessToken = jwt.sign({name: user}, secrets.jwtSecret,
              {expiresIn: '1h'}); // expires in one hour
          res.status(201).json({username, accessToken: accessToken});
        }
      }
    } catch (error) {
      console.log('/login ERROR! ' + error);
    }
  })();
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Token from server: ' + token);
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, secrets.jwtSecret, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    console.log('User (decoded): ' + JSON.stringify(user));
    next();
  });
}
