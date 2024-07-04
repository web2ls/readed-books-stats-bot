const db = require('./db');

const {
  getValidatedDate,
  getValidatedPagesAmount,
  getValidatedRating,
  getValidatedText,
  detectBookFieldForUpdate,
  BOOK_FIELDS_MAPPING,
  BOOK_FIELD_VALIDATOR,
} = require('./helpers');

function addBook(request, response) {
  const value = request.body;

  const newBook = {
    userId: value.userId,
    author: getValidatedText(value.author),
    title: getValidatedText(value.title),
    startedAt: getValidatedDate(value.startedAt),
    finishedAt: getValidatedDate(value.finishedAt),
    pagesAmount: getValidatedPagesAmount(value.pagesAmount),
    rating: getValidatedRating(value.rating),
    review: getValidatedText(value.review),
  };

  const query = `
    INSERT INTO books (user_id, author, title, started_at, finished_at, pages_amount, rating, review ) VALUES ('${newBook.userId}', '${newBook.author}', '${newBook.title}', unixepoch('${newBook.startedAt}'), unixepoch('${newBook.finishedAt ? newBook.finishedAt : null}'), '${newBook.pagesAmount}', '${newBook.rating}', '${newBook.review}')
  `;

  db.run(query, (error) => {
    if (error) {
      console.log('Failed to add new book', error.message);
      response.status(500).end();
    } else {
      console.log('new book has been added');
      response.status(200).send("Book has been added");
    }
  })
}

function getBook(request, response) {
  const bookId = request.params.id;

  const query = `
    SELECT id, author, title, datetime(started_at, 'unixepoch') as started_at, datetime(finished_at, 'unixepoch') as finished_at, pages_amount, rating, review FROM books WHERE id = ${bookId}
  `;

  db.get(query, (error, row) => {
    if (error) {
      console.log('Failed to get book by id', error);
      response.status(500).end();
    } else {
      if (!row) {
        response.status(404).send("Book not found");
        return;
      }

      console.log('finded book is, ', row);
      response.json(row);
    }
  })
}

function searchBook(request, response) {
  const userId = request.query.userId;
  const sanitaizedQuery = getValidatedText(request.query.query);
  if (!sanitaizedQuery) {
    response.json([]);
    return;
  }

  const dbQuery = `
    SELECT * FROM books WHERE user_id = ${userId} AND (author LIKE '%${sanitaizedQuery}%' OR title LIKE '%${sanitaizedQuery}%') LIMIT 10
  `;

  db.all(dbQuery, (err, rows) => {
    if (err) {
      console.error('Failed to search books by query:', err.message);
      response.status(500).end();
    } else {
      response.json(rows);
    }
  });
}

function updateBook(req, res) {
  res.send('book updated');
}

function getBooksByCurrentMonth(request, response) {
  const userId = request.params.userId;
  const currentMonth = new Date().getMonth() + 1;
  const currentMonthAsString = String(currentMonth).padStart(2, '0');
  const currentYear = new Date().getFullYear();

  const query = `
    SELECT * FROM books WHERE strftime('%m', datetime(finished_at, 'unixepoch')) = '${currentMonthAsString}' AND strftime('%Y', datetime(finished_at, 'unixepoch')) = '${currentYear}' AND user_id = ${userId};
  `;

  db.all(query, (error, rows) => {
    if (error) {
      console.log('Failed to get books for current month', error.message);
      response.status(500).end();
    } else {
      console.log('Books for this month finded');
      response.json(rows);
    }
  })
}

function getBooksByCurrentYear(request, response) {
  const userId = request.params.userId;
  const currentYear = new Date().getFullYear();

  const query = `
    SELECT * FROM books WHERE strftime('%Y', datetime(finished_at, 'unixepoch')) = '${currentYear}' AND user_id = ${userId};
  `;

  db.all(query, (error, rows) => {
    if (error) {
      console.log('Failed to get books for current year', error.message);
      response.status(500).end();
    } else {
      console.log('Books for this year finded');
      response.json(rows);
    }
  })
}

function deleteBook(request, response) {
  const bookId = request.params.id;

  const query = `
    DELETE FROM books WHERE id = ${bookId};
  `;

  db.run(query, (error) => {
    if (error) {
      console.log('Failed to delete book', error.message);
      response.status(500).end();
    } else {
      console.log('Books has been deleted');
      response.status(200).send('Book has been deleted');
    }
  })
}

module.exports = {
  addBook,
  getBook,
  deleteBook,
  searchBook,
  getBooksByCurrentMonth,
  getBooksByCurrentYear,
}