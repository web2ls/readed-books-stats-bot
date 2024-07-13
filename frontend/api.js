const API_HOST = process.env.API_HOST;

export function addBook(book) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${API_HOST}/api/books/add`, {
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

export function editBook(book) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${API_HOST}/api/books/edit`, {
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
      const params = { userId, query };
      const urlParams = new URLSearchParams(params).toString();
      const response = await fetch(`${API_HOST}/api/books/search/?${urlParams}`);
      resolve(await response.json());
    } catch(error) {
      reject(error);
    }
  })
}

export function deleteBook(id) {
  return new Promise(async (resolve, reject) => {
    try {
      await fetch(`${API_HOST}/api/books/${ id }`, {
        method: 'DELETE',
      });
      resolve();
    } catch(error) {
      reject(error);
    }
  })
}

export function getBook(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${API_HOST}/api/books/${ id }`);
      resolve(await response.json());
    } catch(error) {
      reject(error);
    }
  })
}

