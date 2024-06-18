const db = require('../db');

const {
  getValidatedDate,
  getValidatedPagesAmount,
  getValidatedRating,
  getValidatedText,
  detectBookFieldForUpdate,
  BOOK_FIELDS_MAPPING,
  BOOK_FIELD_VALIDATOR,
} = require('../helpers');

BookController = {
  getBookById: (id) => {
    return new Promise((resolve, reject) => {
      const getBookByIdQuery = `
        SELECT * FROM books WHERE id = ${id}
      `;

      db.get(getBookByIdQuery, (error, row) => {
        if (error) {
          console.log('Failed to get book by id', error);
          reject();
        } else {
          console.log('finded book is, ', row);
          resolve(row);
        }
      })
    });
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

      console.log(newBook.startedAt);

      const insertNewBookQuery = `
        INSERT INTO books (user_id, author, title, started_at, finished_at, pages_amount, rating, review ) VALUES ('${newBook.userId}', '${newBook.author}', '${newBook.title}', unixepoch('${newBook.startedAt ? newBook.startedAt : NULL}'), unixepoch('${newBook.finishedAt}'), '${newBook.pagesAmount}', '${newBook.rating}', '${newBook.review}')
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
          const buttons = rows.map(book => [`${book.author}: ${book.title} [${book.id}]`]);
          resolve(buttons);
        }
      });
    })
  },

  update: async (bookId, newValue, sourceFieldMessage) => {
    const originalFieldName = detectBookFieldForUpdate(sourceFieldMessage);
    const fieldName = BOOK_FIELDS_MAPPING[originalFieldName];
    const validator = BOOK_FIELD_VALIDATOR[fieldName];
    const validatedValue = validator(newValue);

    return BookController.updateBook(bookId, fieldName, validatedValue);
  },

  updateBook: (id, field, value) => {
    return new Promise((resolve, reject) => {
      const updateBookQuery = `
        UPDATE books SET ${field} = '${value}' WHERE id = '${id}'
      `;

      db.run(updateBookQuery, (error) => {
        if (error) {
          console.log('Failed to update book', error.message);
          reject();
        } else {
          console.log('Book has been updated');
          resolve();
        }
      })
    })
  }
}

module.exports = BookController;