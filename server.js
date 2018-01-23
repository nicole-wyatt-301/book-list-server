'use strict';

const pg = require('pg');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
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

app.get('/articles', (request, response) => {
  client.query(`
    SELECT * FROM articles
    INNER JOIN authors
      ON articles.author_id=authors.author_id;`
  )
    .then(result => response.send(result.rows))
    .catch(console.error);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
