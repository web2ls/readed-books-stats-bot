const db = require('../db');

const {
  getValidatedDate,
  getValidatedPagesAmount,
  getValidatedRating,
  getValidatedText
} = require('../helpers');

BookController = {
  getBookById: (id) => {
    const getBookQuery = `
      SELECT * FROM books
    `
  },

  addBook: (value) => {
    return new Promise((resolve, reject) => {
      const newBook = {
        userId: value.userId,
        author: getValidatedText(value.author),
        title: getValidatedText(value.title),
        startedAt: getValidatedDate(value.startedAt),
        finishedAt: getValidatedDate(value.finishedAt),
        pagesAmount: getValidatedPagesAmount(value.pagesAmount),
        rating: getValidatedRating(value.rating),
        review: getValidatedText(value.review),
      }

      console.log('book item is', newBook);

      const insertNewBookQuery = `
        INSERT INTO books (user_id, author, title, started_at, finished_at, pages_amount, rating, review ) VALUES ('${newBook.userId}', '${newBook.author}', '${newBook.title}', '${newBook.startedAt}', '${newBook.finishedAt}', '${newBook.pagesAmount}', '${newBook.rating}', '${newBook.review}')
      `;

      db.run(insertNewBookQuery, (error) => {
        if (error) {
          console.log('Failed to insert new book', error.message);
          reject();
        } else {
          console.log('new book has been inserted');
          resolve();
        }
      })
    })
  },

  searchBook: (query) => {
    return new Promise((resolve, reject) => {
      const searchBooksQuery = `
        SELECT * FROM books WHERE author LIKE '%${query}%' OR title LIKE '%${query}%' LIMIT 5
      `;

      db.all(searchBooksQuery, (err, rows) => {
        if (err) {
          console.error('Failed to search books by query:', err.message);
          reject();
        } else {
          console.log('Search has been completed:', rows);
          const buttons = rows.map(book => [{ text: `${book.author}: ${book.title} [${book.id}]`, id: book.id }]);
          resolve(buttons);
        }
      });
    })
  }
}

module.exports = BookController;