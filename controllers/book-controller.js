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
      const query = `
        SELECT id, author, title, datetime(started_at, 'unixepoch') as started_at, datetime(finished_at, 'unixepoch') as finished_at, pages_amount, rating, review FROM books WHERE id = ${id}
      `;

      db.get(query, (error, row) => {
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

      const query = `
        INSERT INTO books (user_id, author, title, started_at, finished_at, pages_amount, rating, review ) VALUES ('${newBook.userId}', '${newBook.author}', '${newBook.title}', unixepoch('${newBook.startedAt}'), unixepoch('${newBook.finishedAt ? newBook.finishedAt : null}'), '${newBook.pagesAmount}', '${newBook.rating}', '${newBook.review}')
      `;

      db.run(query, (error) => {
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

  searchBook: (query, userId) => {
    return new Promise((resolve, reject) => {
      const searchBooksQuery = `
        SELECT * FROM books WHERE user_id = ${userId} AND (author LIKE '%${query}%' OR title LIKE '%${query}%') LIMIT 5
      `;

      db.all(searchBooksQuery, (err, rows) => {
        if (err) {
          console.error('Failed to search books by query:', err.message);
          reject();
        } else {
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
      let query = '';

      if (field === BOOK_FIELDS_MAPPING.Начали || field === BOOK_FIELDS_MAPPING.Закончили) {
        query = `
          UPDATE books SET ${field} = unixepoch('${value}') WHERE id = '${id}'
        `;
      } else {
        query = `
          UPDATE books SET ${field} = '${value}' WHERE id = '${id}'
        `;
      }

      db.run(query, (error) => {
        if (error) {
          console.log('Failed to update book', error.message);
          reject();
        } else {
          console.log('Book has been updated');
          resolve();
        }
      })
    })
  },

  getBooksAmountByCurrentMonth: (userId) => {
    return new Promise((resolve, reject) => {
      const currentMonth = new Date().getMonth() + 1;
      const currentMonthAsString = String(currentMonth).padStart(2, '0');
      const currentYear = new Date().getFullYear();

      const query = `
        SELECT COUNT(*) as amount FROM books WHERE strftime('%m', datetime(finished_at, 'unixepoch')) = '${currentMonthAsString}' AND strftime('%Y', datetime(finished_at, 'unixepoch')) = '${currentYear}' AND user_id = ${userId};
      `;

      db.get(query, (error, row) => {
        if (error) {
          console.log('Failed to get books for current month', error.message);
          reject();
        } else {
          console.log('Books for this month finded');
          resolve(row);
        }
      })
    })
  },

  getBooksListByCurrentMonth: (userId) => {
    return new Promise((resolve, reject) => {
      const currentMonth = new Date().getMonth() + 1;
      const currentMonthAsString = String(currentMonth).padStart(2, '0');
      const currentYear = new Date().getFullYear();

      const query = `
        SELECT author, title FROM books WHERE strftime('%m', datetime(finished_at, 'unixepoch')) = '${currentMonthAsString}' AND strftime('%Y', datetime(finished_at, 'unixepoch')) = '${currentYear}' AND user_id = ${userId};
      `;

      db.all(query, async (error, rows) => {
        if (error) {
          console.log('Failed to get books for current month', error.message);
          reject();
        } else {
          console.log('Books for this month finded');
          if (!rows.length) {
            resolve('За этот месяц нет прочитанных книг');
            return;
          }

          const result = rows.map(book => `${book.author}: ${book.title}`);
          resolve(result.join('\n'));
        }
      })
    })
  },

  getBooksAmountByCurrentYear: (userId) => {
    return new Promise((resolve, reject) => {
      const currentYear = new Date().getFullYear();

      const query = `
        SELECT COUNT(*) as amount FROM books WHERE strftime('%Y', datetime(finished_at, 'unixepoch')) = '${currentYear}' AND user_id = ${userId};
      `;

      db.get(query, (error, row) => {
        if (error) {
          console.log('Failed to get books for current month', error.message);
          reject();
        } else {
          console.log('Books for this month finded');
          resolve(row);
        }
      })
    })
  },

  deleteBook: (bookId) => {
    return new Promise((resolve, reject) => {
      const query = `
      DELETE FROM books WHERE id = ${bookId};
    `;

    db.run(query, (error) => {
      if (error) {
        console.log('Failed to delete book', error.message);
        reject();
      } else {
        console.log('Books has been deleted');
        resolve();
      }
    })
    })
  },
}

module.exports = BookController;