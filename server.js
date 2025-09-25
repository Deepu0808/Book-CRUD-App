const express = require("express");
const app = express();
const port = process.env.PORT || 3000; // ✅ Use dynamic port for Render

// Middleware
app.use(express.json());

// Serve frontend (if needed)
app.use(express.static("public"));

// In-memory books
let books = [
  { id: 1, title: "Atomic Habits", author: "James Clear" },
  { id: 2, title: "The Alchemist", author: "Paulo Coelho" }
];

// Root route for Render health check
app.get("/", (req, res) => {
  res.send("📚 Book CRUD API is running on Render 🚀");
});

// --- API Routes ---
// GET all books
app.get("/books", (req, res) => res.json(books));

// POST add book
app.post("/books", (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) return res.status(400).json({ message: "Title & author required" });

  const newBook = { id: books.length ? books[books.length - 1].id + 1 : 1, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT update book
app.put("/books/:id", (req, res) => {
  const { id } = req.params;
  const { title, author } = req.body;
  const book = books.find(b => b.id === parseInt(id));
  if (!book) return res.status(404).json({ message: "Book not found" });

  if (title) book.title = title;
  if (author) book.author = author;

  res.json(book);
});

// DELETE book
app.delete("/books/:id", (req, res) => {
  const { id } = req.params;
  const index = books.findIndex(b => b.id === parseInt(id));
  if (index === -1) return res.status(404).json({ message: "Book not found" });

  const deleted = books.splice(index, 1);
  res.json({ message: "Deleted", book: deleted });
});

app.listen(port, () => console.log(`📚 Server running on port ${port}`));
