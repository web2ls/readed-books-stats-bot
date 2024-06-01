const db = require('../db');

async function findBookController(query) {
  const searchBooksQuery = `
    SELECT * FROM books WHERE author LIKE '%${query}%' OR title LIKE '%${query}%' LIMIT 5
  `;

  // TODO: return results to user
  db.all(searchBooksQuery, (err, rows) => {
    if (err) {
      console.error('Failed to search books by query:', err.message);
    } else {
      console.log('Search has been completed:', rows);
    }
  });
}

module.exports = findBookController;
