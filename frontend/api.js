export function addBook(book) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('http://localhost:8000/api/books', {
        method: 'POST',
        body: JSON.stringify(book),
      });
      resolve(response);
    } catch(error) {
      reject(error);
    }
  })
}