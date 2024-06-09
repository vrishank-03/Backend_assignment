// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/bookdb')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Could not connect to MongoDB', err);
  });

const bookSchema = new mongoose.Schema({
  name: String,
  img: String,
  summary: String
});

const Book = mongoose.model('Book', bookSchema);

app.post('/books', async (req, res) => {
  const book = new Book(req.body);
  try {
    await book.save();
    res.status(201).send(book);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).send(books);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/books/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const book = await Book.findById(_id);
    if (!book) {
      return res.status(404).send();
    }
    res.status(200).send(book);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.patch('/books/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const book = await Book.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
    if (!book) {
      return res.status(404).send();
    }
    res.status(200).send(book);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/books/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const book = await Book.findByIdAndDelete(_id);
    if (!book) {
      return res.status(404).send();
    }
    res.status(200).send(book);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route handler for the root URL
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

