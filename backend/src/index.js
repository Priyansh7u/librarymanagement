const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ─── In-Memory Database ───────────────────────────────────────────────────────
let books = [
  { id: uuidv4(), title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic Fiction', isbn: '978-0743273565', year: 1925, copies: 3, available: 3, description: 'A story of the fabulously wealthy Jay Gatsby and his love for Daisy Buchanan.', coverColor: '#2D6A4F' },
  { id: uuidv4(), title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Classic Fiction', isbn: '978-0061935466', year: 1960, copies: 5, available: 4, description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.', coverColor: '#E76F51' },
  { id: uuidv4(), title: 'Dune', author: 'Frank Herbert', genre: 'Science Fiction', isbn: '978-0441013593', year: 1965, copies: 4, available: 4, description: 'The interstellar empire and the planet Arrakis — source of the most valuable substance in the universe.', coverColor: '#E9C46A' },
  { id: uuidv4(), title: '1984', author: 'George Orwell', genre: 'Dystopian', isbn: '978-0451524935', year: 1949, copies: 6, available: 5, description: 'A chilling portrait of a totalitarian society and one man\'s defiance.', coverColor: '#264653' },
  { id: uuidv4(), title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Philosophical Fiction', isbn: '978-0062315007', year: 1988, copies: 4, available: 3, description: 'A philosophical novel about a young Andalusian shepherd\'s journey to find treasure.', coverColor: '#8338EC' },
  { id: uuidv4(), title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'Non-Fiction', isbn: '978-0062316097', year: 2011, copies: 3, available: 2, description: 'A brief history of humankind, from ancient humans to the present.', coverColor: '#FB5607' },
  { id: uuidv4(), title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', isbn: '978-0735211292', year: 2018, copies: 5, available: 5, description: 'An easy and proven way to build good habits and break bad ones.', coverColor: '#3A86FF' },
  { id: uuidv4(), title: 'The Midnight Library', author: 'Matt Haig', genre: 'Contemporary Fiction', isbn: '978-0525559474', year: 2020, copies: 3, available: 3, description: 'Between life and death there is a library, and within that library, the shelves go on forever.', coverColor: '#118AB2' },
];

let members = [
  { id: uuidv4(), name: 'Arjun Sharma', email: 'arjun.sharma@email.com', phone: '+91 98765 43210', joinDate: '2024-01-15', membershipType: 'Premium', booksIssued: 1, address: 'Connaught Place, New Delhi' },
  { id: uuidv4(), name: 'Priya Patel', email: 'priya.patel@email.com', phone: '+91 87654 32109', joinDate: '2024-02-20', membershipType: 'Standard', booksIssued: 2, address: 'Bandra West, Mumbai' },
  { id: uuidv4(), name: 'Rahul Verma', email: 'rahul.verma@email.com', phone: '+91 76543 21098', joinDate: '2024-03-10', membershipType: 'Standard', booksIssued: 0, address: 'Koramangala, Bangalore' },
  { id: uuidv4(), name: 'Sneha Gupta', email: 'sneha.gupta@email.com', phone: '+91 65432 10987', joinDate: '2024-04-05', membershipType: 'Premium', booksIssued: 1, address: 'Salt Lake, Kolkata' },
];

let transactions = [];

// Initialize some transactions
const bookIds = books.map(b => b.id);
const memberIds = members.map(m => m.id);

transactions.push({
  id: uuidv4(),
  bookId: bookIds[1],
  memberId: memberIds[0],
  bookTitle: books[1].title,
  memberName: members[0].name,
  issueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  returnDate: null,
  status: 'issued',
  fine: 0
});

transactions.push({
  id: uuidv4(),
  bookId: bookIds[4],
  memberId: memberIds[1],
  bookTitle: books[4].title,
  memberName: members[1].name,
  issueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  returnDate: null,
  status: 'overdue',
  fine: 30
});

transactions.push({
  id: uuidv4(),
  bookId: bookIds[5],
  memberId: memberIds[1],
  bookTitle: books[5].title,
  memberName: members[1].name,
  issueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  returnDate: null,
  status: 'issued',
  fine: 0
});

// Update available books count based on transactions
books[1].available = 4;
books[4].available = 3;
books[5].available = 2;

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
app.get('/api/dashboard', (req, res) => {
  const totalBooks = books.reduce((sum, b) => sum + b.copies, 0);
  const availableBooks = books.reduce((sum, b) => sum + b.available, 0);
  const issuedBooks = totalBooks - availableBooks;
  const overdueBooks = transactions.filter(t => t.status === 'overdue').length;
  const totalFines = transactions.reduce((sum, t) => sum + (t.fine || 0), 0);
  const recentTransactions = [...transactions].reverse().slice(0, 5);

  const genreStats = {};
  books.forEach(b => {
    genreStats[b.genre] = (genreStats[b.genre] || 0) + 1;
  });

  res.json({
    stats: {
      totalBooks,
      availableBooks,
      issuedBooks,
      overdueBooks,
      totalMembers: members.length,
      totalFines,
    },
    recentTransactions,
    genreStats,
  });
});

// ─── BOOKS ROUTES ─────────────────────────────────────────────────────────────
app.get('/api/books', (req, res) => {
  const { search, genre } = req.query;
  let result = [...books];
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.includes(q)
    );
  }
  if (genre && genre !== 'all') result = result.filter(b => b.genre === genre);
  res.json(result);
});

app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

app.post('/api/books', (req, res) => {
  const { title, author, genre, isbn, year, copies, description, coverColor } = req.body;
  if (!title || !author || !isbn) return res.status(400).json({ error: 'Title, author and ISBN required' });
  const book = {
    id: uuidv4(), title, author,
    genre: genre || 'General',
    isbn, year: parseInt(year) || new Date().getFullYear(),
    copies: parseInt(copies) || 1,
    available: parseInt(copies) || 1,
    description: description || '',
    coverColor: coverColor || '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
  };
  books.push(book);
  res.status(201).json(book);
});

app.put('/api/books/:id', (req, res) => {
  const idx = books.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Book not found' });
  const updated = { ...books[idx], ...req.body, id: req.params.id };
  books[idx] = updated;
  res.json(updated);
});

app.delete('/api/books/:id', (req, res) => {
  const idx = books.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Book not found' });
  books.splice(idx, 1);
  res.json({ message: 'Book deleted successfully' });
});

// ─── MEMBERS ROUTES ───────────────────────────────────────────────────────────
app.get('/api/members', (req, res) => {
  const { search } = req.query;
  let result = [...members];
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.phone.includes(q)
    );
  }
  res.json(result);
});

app.get('/api/members/:id', (req, res) => {
  const member = members.find(m => m.id === req.params.id);
  if (!member) return res.status(404).json({ error: 'Member not found' });
  const memberTransactions = transactions.filter(t => t.memberId === req.params.id);
  res.json({ ...member, transactions: memberTransactions });
});

app.post('/api/members', (req, res) => {
  const { name, email, phone, address, membershipType } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
  if (members.find(m => m.email === email)) return res.status(400).json({ error: 'Email already registered' });
  const member = {
    id: uuidv4(), name, email,
    phone: phone || '',
    address: address || '',
    membershipType: membershipType || 'Standard',
    joinDate: new Date().toISOString().split('T')[0],
    booksIssued: 0
  };
  members.push(member);
  res.status(201).json(member);
});

app.put('/api/members/:id', (req, res) => {
  const idx = members.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Member not found' });
  members[idx] = { ...members[idx], ...req.body, id: req.params.id };
  res.json(members[idx]);
});

app.delete('/api/members/:id', (req, res) => {
  const idx = members.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Member not found' });
  members.splice(idx, 1);
  res.json({ message: 'Member deleted successfully' });
});

// ─── TRANSACTIONS ROUTES ──────────────────────────────────────────────────────
app.get('/api/transactions', (req, res) => {
  const { status, memberId } = req.query;
  let result = [...transactions];
  if (status && status !== 'all') result = result.filter(t => t.status === status);
  if (memberId) result = result.filter(t => t.memberId === memberId);
  res.json(result.reverse());
});

app.post('/api/transactions/issue', (req, res) => {
  const { bookId, memberId, daysAllowed } = req.body;
  const book = books.find(b => b.id === bookId);
  const member = members.find(m => m.id === memberId);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  if (!member) return res.status(404).json({ error: 'Member not found' });
  if (book.available <= 0) return res.status(400).json({ error: 'No copies available' });

  const days = parseInt(daysAllowed) || 14;
  const issueDate = new Date().toISOString().split('T')[0];
  const dueDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const transaction = {
    id: uuidv4(), bookId, memberId,
    bookTitle: book.title,
    memberName: member.name,
    issueDate, dueDate,
    returnDate: null,
    status: 'issued',
    fine: 0
  };
  transactions.push(transaction);
  book.available -= 1;
  member.booksIssued += 1;
  res.status(201).json(transaction);
});

app.post('/api/transactions/return/:id', (req, res) => {
  const txn = transactions.find(t => t.id === req.params.id);
  if (!txn) return res.status(404).json({ error: 'Transaction not found' });
  if (txn.status === 'returned') return res.status(400).json({ error: 'Already returned' });

  const returnDate = new Date().toISOString().split('T')[0];
  const due = new Date(txn.dueDate);
  const ret = new Date(returnDate);
  const overdueDays = Math.max(0, Math.floor((ret - due) / (24 * 60 * 60 * 1000)));
  const fine = overdueDays * 5;

  txn.returnDate = returnDate;
  txn.status = 'returned';
  txn.fine = fine;

  const book = books.find(b => b.id === txn.bookId);
  if (book) book.available += 1;
  const member = members.find(m => m.id === txn.memberId);
  if (member) member.booksIssued = Math.max(0, member.booksIssued - 1);

  res.json(txn);
});

// ─── GENRES ───────────────────────────────────────────────────────────────────
app.get('/api/genres', (req, res) => {
  const genres = [...new Set(books.map(b => b.genre))];
  res.json(genres);
});

// ─── START ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n📚 Library Management API running at http://localhost:${PORT}`);
  console.log(`   Books: ${books.length} | Members: ${members.length} | Transactions: ${transactions.length}\n`);
});
