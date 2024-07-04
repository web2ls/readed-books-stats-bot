export function addBook(req, res) {
  res.send('Book added');
}

export function getBook(req, res) {
  res.send('book finded');
}

export function searchBook(req, res) {
  res.send('search book');
}

export function updateBook(req, res) {
  res.send('book updated');
}

export function getBooksByCurrentMonth(req, res) {
  res.send('books by cureent month');
}

export function getBooksByCurrentYear(req, res) {
  res.send('books by cureent year');
}

export function deleteBook(req, res) {
  res.send('book deleted');
}