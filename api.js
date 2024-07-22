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
  request.log.info('=== ADD BOOK REQUEST ===');
  const value = request.body;

  const newBook = {
    user_id: value.user_id,
    author: getValidatedText(value.author),
    title: getValidatedText(value.title),
    started_at: getValidatedDate(value.started_at),
    finished_at: getValidatedDate(value.finished_at),
    pages_amount: getValidatedPagesAmount(value.pages_amount),
    rating: getValidatedRating(value.rating),
    review: getValidatedText(value.review),
  };

  const query = `
    INSERT INTO books (user_id, author, title, started_at, finished_at, pages_amount, rating, review ) VALUES ('${newBook.user_id}', '${newBook.author}', '${newBook.title}', unixepoch('${newBook.started_at}'), unixepoch('${newBook.finished_at}'), '${newBook.pages_amount}', '${newBook.rating}', '${newBook.review}')
  `;

  db.run(query, (error) => {
    if (error) {
      request.log.error(error, error.message);
      response.status(500).json(error);
    } else {
      console.log('new book has been added');
      response.status(201).send("OK");
    }
  })
}

function editBook(request, response) {
  request.log.info('=== EDIT BOOK REQUEST ===');
  const value = request.body;

  const updatedBook = {
    user_id: value.user_id,
    author: getValidatedText(value.author),
    title: getValidatedText(value.title),
    started_at: getValidatedDate(value.started_at),
    finished_at: getValidatedDate(value.finished_at),
    pages_amount: getValidatedPagesAmount(value.pages_amount),
    rating: getValidatedRating(value.rating),
    review: getValidatedText(value.review),
  };

  const query = `
    UPDATE books SET user_id = '${updatedBook.user_id}', author = '${updatedBook.author}', title = '${updatedBook.title}', started_at = unixepoch('${updatedBook.started_at}'), finished_at = unixepoch('${updatedBook.finished_at}'), pages_amount = '${updatedBook.pages_amount}', rating = '${updatedBook.rating}', review = '${updatedBook.review}' WHERE id = ${value.id}
  `;

  db.run(query, (error) => {
    if (error) {
      request.log.error(error, error.message);
      response.status(500).json(error);
    } else {
      console.log('book has been updated');
      response.status(200).send("OK");
    }
  })
}

function getBook(request, response) {
  request.log.info('=== GET BOOK BY ID REQUEST ===');
  const bookId = request.params.id;

  const query = `
    SELECT id, user_id, author, title, datetime(started_at, 'unixepoch') as started_at, datetime(finished_at, 'unixepoch') as finished_at, pages_amount, rating, review FROM books WHERE id = ${bookId};
  `;

  db.get(query, (error, row) => {
    if (error) {
      request.log.error(error, error.message);
      response.status(500).end();
    } else {
      if (!row) {
        response.status(404).send("Book not found");
        return;
      }

      console.log('finded book is: ', row);
      response.json(row);
    }
  })
}

function searchBook(request, response) {
  request.log.info('=== SEARCH BOOK BY QUERY REQUEST ===');
  const userId = request.query.userId;
  const sanitaizedQuery = getValidatedText(request.query.query);
  if (!sanitaizedQuery) {
    response.json([]);
    return;
  }

  const dbQuery = `
    SELECT * FROM books WHERE user_id = ${userId} AND (author LIKE '%${sanitaizedQuery}%' OR author LIKE '%${sanitaizedQuery.charAt(0).toUpperCase() + sanitaizedQuery.slice(1)}%' OR title LIKE '%${sanitaizedQuery}%' OR title LIKE '%${sanitaizedQuery.charAt(0).toUpperCase() + sanitaizedQuery.slice(1)}%') LIMIT 10;
  `;

  db.all(dbQuery, (error, rows) => {
    if (error) {
      request.log.error(error, error.message);
      response.status(500).end();
    } else {
      console.log('search books has been completed');
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
  request.log.info('=== DELETE BOOK REQUEST ===');
  const bookId = request.params.id;

  const query = `
    DELETE FROM books WHERE id = ${bookId};
  `;

  db.run(query, (error) => {
    if (error) {
      request.log.error(error, error.message);
      response.status(500).json(error);
    } else {
      console.log('Books has been deleted');
      response.status(200).send('OK');
    }
  })
}

function getBooksCountByCurrentMonth(userId) {
  return new Promise((resolve, reject) => {
    const currentMonth = new Date().getMonth() + 1;
    const currentMonthAsString = String(currentMonth).padStart(2, '0');
    const currentYear = new Date().getFullYear();

    const query = `
      SELECT COUNT(*) as count FROM books WHERE strftime('%m', datetime(finished_at, 'unixepoch')) = '${currentMonthAsString}' AND strftime('%Y', datetime(finished_at, 'unixepoch')) = '${currentYear}' AND user_id = ${userId};
    `;

    db.get(query, (error, row) => {
      if (error) {
        reject(error);
      } else {
        resolve(row);
      }
    })
  })
}

function getBooksCountByCurrentYear(userId) {
  return new Promise((resolve, reject) => {
    const currentYear = new Date().getFullYear();

    const query = `
      SELECT COUNT(*) as count FROM books WHERE strftime('%Y', datetime(finished_at, 'unixepoch')) = '${currentYear}' AND user_id = ${userId};
    `;

    db.get(query, (error, row) => {
      if (error) {
        reject(error);
      } else {
        resolve(row);
      }
    })
  })
}

function getAllBooksCount(userId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT COUNT(*) as count FROM books WHERE finished_at IS NOT NULL AND user_id = ${userId};
    `;

    db.get(query, (error, row) => {
      if (error) {
        reject(error);
      } else {
        resolve(row);
      }
    })
  })
}

async function getQuickStats(request, response) {
  request.log.info('=== GET QUICK STATS REQUEST ===');
  const userId = request.params.id;

  const byCurrentMonth = await getBooksCountByCurrentMonth(userId);
  const byCurrentYear = await getBooksCountByCurrentYear(userId);
  const allReadedBooks = await getAllBooksCount(userId);
  const result = [];
  result.push({
    name: 'За текущий месяц',
    value: byCurrentMonth.count,
  });
  result.push({
    name: 'За текущий год',
    value: byCurrentYear.count,
  });
  result.push({
    name: 'Всего прочитано',
    value: allReadedBooks.count,
  });
  response.json(result);
}

module.exports = {
  addBook,
  editBook,
  getBook,
  deleteBook,
  searchBook,
  getBooksByCurrentMonth,
  getBooksByCurrentYear,
  getAllBooksCount,
  getQuickStats,
}