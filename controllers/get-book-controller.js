const db = require('../db');

// TODO: move all actions with books here
BookController = {
  getBookById: (id) => {
    const getBookQuery = `
      SELECT * FROM books
    `
  }
}

module.exports = GetBookController;