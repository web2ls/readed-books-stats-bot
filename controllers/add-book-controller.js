const db = require('../db');

// TODO: add sanitazing for user inputs
function addBookController(newBook) {
  return new Promise((resolve, reject) => {
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

}

module.exports = addBookController;
