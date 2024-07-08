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
    userId: value.userId || 123,
    author: getValidatedText(value.author),
    title: getValidatedText(value.title),
    started_at: getValidatedDate(value.started_at),
    finished_at: getValidatedDate(value.finished_at),
    pages_amount: getValidatedPagesAmount(value.pages_amount),
    rating: getValidatedRating(value.rating),
    review: getValidatedText(value.review),
  };

  const query = `
    INSERT INTO books (user_id, author, title, started_at, finished_at, pages_amount, rating, review ) VALUES ('${newBook.userId}', '${newBook.author}', '${newBook.title}', unixepoch('${newBook.started_at}'), unixepoch('${newBook.finished_at}'), '${newBook.pages_amount}', '${newBook.rating}', '${newBook.review}')
  `;

  db.run(query, (error) => {
    if (error) {
      console.log('Failed to add new book', error.message);
      response.status(500).json(error);
    } else {
      console.log('new book has been added');
      response.status(201).send("OK");
    }
  })
}

function editBook(request, response) {
  const value = request.body;

  const updatedBook = {
    userId: value.userId || 123,
    author: getValidatedText(value.author),
    title: getValidatedText(value.title),
    started_at: getValidatedDate(value.started_at),
    finished_at: getValidatedDate(value.finished_at),
    pages_amount: getValidatedPagesAmount(value.pages_amount),
    rating: getValidatedRating(value.rating),
    review: getValidatedText(value.review),
  };

  const query = `
    UPDATE books SET user_id = "${updatedBook.userId}", author = "${updatedBook.author}", title = "${updatedBook.title}", started_at = "${updatedBook.started_at}", finished_at = "${updatedBook.finished_at}", pages_amount = "${updatedBook.pages_amount}", rating = "${updatedBook.rating}", review = "${updatedBook.review}" WHERE id = ${value.id}
  `;

  db.run(query, (error) => {
    if (error) {
      console.log('Failed to update book', error.message);
      response.status(500).json(error);
    } else {
      console.log('book has been updated');
      response.status(200).send("OK");
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
      response.status(500).json(error);
    } else {
      console.log('Books has been deleted');
      response.status(200).send('OK');
    }
  })
}

module.exports = {
  addBook,
  editBook,
  getBook,
  deleteBook,
  searchBook,
  getBooksByCurrentMonth,
  getBooksByCurrentYear,
}