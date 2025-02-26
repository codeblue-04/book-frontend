import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, Check, Plus } from "lucide-react";
import "../public/styles.css";

const App = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: "", author: "", image_url: "" });
  const [editBook, setEditBook] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const uri = "https://m6x3334g-5001.asse.devtunnels.ms/books";

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(uri);
      setBooks(response.data.books);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (editBook) {
      setEditBook({ ...editBook, [name]: value });
    } else {
      setNewBook({ ...newBook, [name]: value });
    }
  };

  const handleCreateBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.image_url) return;
    try {
      const response = await axios.post(uri, newBook);
      setBooks([...books, response.data]);
      setNewBook({ title: "", author: "", image_url: "" });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating book:", error);
    }
  };

  const handleEditBook = (book) => {
    setEditBook({ ...book });
  };

  const handleUpdateBook = async () => {
    if (!editBook || !editBook.title || !editBook.author || !editBook.image_url) return;
    try {
      const response = await axios.put(`${uri}/${editBook.id}`, editBook);
      setBooks(books.map((book) => (book.id === editBook.id ? response.data : book)));
      setEditBook(null);
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const handleDeleteBook = async () => {
    try {
      await axios.delete(`${uri}/${deleteConfirm}`);
      setBooks(books.filter((book) => book.id !== deleteConfirm));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div className="container">
      <h1>Book List</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Title</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td className="image-container">
                  {editBook && editBook.id === book.id ? (
                    <input
                      type="text"
                      name="image_url"
                      value={editBook.image_url}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <img src={book.image_url} alt={book.title} />
                  )}
                </td>
                <td>
                  {editBook && editBook.id === book.id ? (
                    <input
                      type="text"
                      name="title"
                      value={editBook.title}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    book.title
                  )}
                </td>
                <td>
                  {editBook && editBook.id === book.id ? (
                    <input
                      type="text"
                      name="author"
                      value={editBook.author}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    book.author
                  )}
                </td>
                <td className="p-3 action-buttons">
                  {editBook && editBook.id === book.id ? (
                    <button onClick={handleUpdateBook} className="button confirm">
                      <Check size={18} />
                    </button>
                  ) : (
                    <button onClick={() => handleEditBook(book)} className="button edit">
                      <Pencil size={18} />
                    </button>
                  )}
                  <button onClick={() => setDeleteConfirm(book.id)} className="button delete">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ปุ่ม Create */}
      <button className="button create" onClick={() => setShowCreateForm(true)}>
        <Plus size={18} /> Create
      </button>

      {/* ฟอร์มสร้างหนังสือใหม่ */}
      {showCreateForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Book</h2>
            <input
              type="text"
              placeholder="Title"
              name="title"
              className="input-field"
              value={newBook.title}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Author"
              name="author"
              className="input-field"
              value={newBook.author}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Image URL"
              name="image_url"
              className="input-field"
              value={newBook.image_url}
              onChange={handleInputChange}
            />
            <div className="modal-buttons">
              <button onClick={handleCreateBook} className="button confirm">
                Submit
              </button>
              <button onClick={() => setShowCreateForm(false)} className="button delete">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this book?</p>
            <div className="modal-buttons">
              <button onClick={handleDeleteBook} className="button delete">Confirm</button>
              <button onClick={() => setDeleteConfirm(null)} className="button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
