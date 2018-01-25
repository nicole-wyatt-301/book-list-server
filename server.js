'use strict';
const cors = require('cors');
const fs = require('fs');
const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT;
const connectionString = process.env.DATABASE_URL;
const client = new pg.Client(connectionString);
client.connect();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/test', (req, res) => res.send('hello world'));

app.get('/api/v1/books/:id', (request, response) => {
  console.log(request.params.id);
  client.query(`
  SELECT * FROM books WHERE books_id = ${request.params.id};
`)
    .then(result => response.send(result.rows))
    .catch(console.error);
});


app.get('/api/v1/books', function (request, response) {
  client.query('SELECT books_id, title, author, image_url FROM books;')
    .then(function (data) {
      response.send(data);
    })
    .catch(function (err) {
      console.error(err);
    });
});


app.post('/api/v1/books', function (request, response) {
  client.query(`
    INSERT INTO books(books_id, author, title, isbn, image_url, "description")
    VALUES($1, $2, $3, $4, $5, $6);
    `,
    [
      request.params.id,
      request.body.author,
      request.body.title,
      request.body.isbn,
      request.body.image_url,
      request.body.description
    ]
  )
    .then(function (data) {
      console.log('table created');
      response.redirect('/');
    })
    .catch(function (err) {
      console.error(err);
    });
});

//createTable();

app.listen(PORT, () => {
  console.log(`currently listening on ${PORT}`);
});

app.get('*', (req, res) => {
  res.sendFile('index.html', {root: './book-list-client'})
})

//  THIS WAS USED ONCE TO LOAD FILL DATABASE WITH THE BOOKS TABLE, THIS ONLY NEEDS TO OCCUR ONCE OR IF THE DATABASE IS DELETED SO WE COMMENTED IT OUT FOR FUTURE USAGE.
// ////// ** DATABASE LOADERS ** ////////
// //////////////////////////////////////
// function loadBooks() {
//   fs.readFile('../book-list-client/data/books.json', (err, fd) => {
//     JSON.parse(fd.toString()).forEach(ele => {
//       client.query(
//         'INSERT INTO books(author, title, isbn, image_url, description) VALUES($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
//         [ele.author, ele.title, ele.isbn, ele.image_url, ele.descriotion]
//       )
//         .catch(console.error);
//     })
//   })
// }

// function createTable() {
//   client.query(`
//     CREATE TABLE IF NOT EXISTS books(
//       books_id SERIAL PRIMARY KEY,
//       author VARCHAR(60),
//       title VARCHAR(80),
//       isbn VARCHAR(23),
//       image_url VARCHAR(255),
//       description VARCHAR(500)
//     );`
//   )
//     .then(function (response) {
//       console.log('created books table in db!!!!');
//     })
//     .then(loadBooks)
// }