const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(express.json());

let books = [
  { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925, genre: 'Fiction' },
  { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960, genre: 'Fiction' }
];

app.get('/api/books', (req, res) => res.json(books));

app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  book ? res.json(book) : res.status(404).json({ error: 'Book not found' });
});

app.post('/api/books', (req, res) => {
  const { title, author, year, genre } = req.body;
  if (!title || !author || !year || !genre) {
    return res.status(400).json({ error: 'All fields (title, author, year, genre) are required' });
  }
  const newBook = { id: uuidv4(), title, author, year: parseInt(year), genre };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.put('/api/books/:id', (req, res) => {
  const index = books.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Book not found' });
  
  const { title, author, year, genre } = req.body;
  if (!title || !author || !year || !genre) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  books[index] = { id: req.params.id, title, author, year: parseInt(year), genre };
  res.json(books[index]);
});

app.patch('/api/books/:id', (req, res) => {
  const index = books.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Book not found' });
  
  books[index] = { ...books[index], ...req.body };
  if (req.body.year) books[index].year = parseInt(req.body.year);
  res.json(books[index]);
});

app.delete('/api/books/:id', (req, res) => {
  const index = books.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Book not found' });
  
  const deleted = books[index];
  books = books.filter(b => b.id !== req.params.id);
  res.json({ message: 'Book deleted', book: deleted });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
