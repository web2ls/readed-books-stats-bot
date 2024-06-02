const db = require('../db');

async function findBookController(query) {
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
}

module.exports = findBookController;
