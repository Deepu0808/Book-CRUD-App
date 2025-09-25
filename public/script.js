const bookList = document.getElementById("book-list");
const form = document.getElementById("book-form");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
let editingBookId = null; // Track if we are editing a book

// Fetch all books
async function fetchBooks() {
  const res = await fetch("/books");
  const books = await res.json();
  bookList.innerHTML = "";

  books.forEach(book => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><strong>${book.title}</strong> - <em>${book.author}</em></span>
      <div>
        <button onclick="editBook(${book.id}, '${book.title}', '${book.author}')">✏️ Edit</button>
        <button onclick="deleteBook(${book.id})" class="delete-btn">❌ Delete</button>

      </div>
    `;
    bookList.appendChild(li);
  });
}

// Add or Update book
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();

  if (!title || !author) return alert("Please enter both title and author");

  if (editingBookId) {
    // Update existing book
    await fetch(`/books/${editingBookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author })
    });
    editingBookId = null;
    form.querySelector("button").textContent = "Add Book"; // Reset button text
  } else {
    // Add new book
    await fetch("/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author })
    });
  }

  titleInput.value = "";
  authorInput.value = "";
  fetchBooks();
});

// Delete book
async function deleteBook(id) {
  await fetch(`/books/${id}`, { method: "DELETE" });
  fetchBooks();
}

// Edit book (prefill form)
function editBook(id, title, author) {
  titleInput.value = title;
  authorInput.value = author;
  editingBookId = id;
  form.querySelector("button").textContent = "Update Book"; // Change button text
}

// Initial load
fetchBooks();
