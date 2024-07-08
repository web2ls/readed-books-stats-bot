export function addBook(book) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('http://localhost:8000/api/books/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
      });
      resolve(response);
    } catch(error) {
      reject(error);
    }
  })
}

export function searchBook(userId, query) {
  return new Promise(async (resolve, reject) => {
    try {
      const url = new URL('http://localhost:8000/api/books/search');
      const params = { userId, query };
      url.search = new URLSearchParams(params).toString();
      const response = await fetch(url);
      resolve(await response.json());
    } catch(error) {
      reject(error);
    }
  })
}

export function deleteBook(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const url = new URL(`http://localhost:8000/api/books/${ id }`);
      await fetch(url, {
        method: 'DELETE',
      });
      resolve();
    } catch(error) {
      reject(error);
    }
  })
}