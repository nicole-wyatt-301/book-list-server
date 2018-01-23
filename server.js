'use strict';

const pg = require('pg');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.DATABASE_URL;
const app = express();
const conString = 'postgres://postgres:10131820ni@localhost:5432/postgres';
const client = new pg.Client(conString);
client.connect();
client.on('error', err => {
  console.error(err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.get('/api/resource', (req, res) => {
    res.status(200).send('you just made a request!');
});

app.post('/') {
    // not sure what goes here
}

app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
