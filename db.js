const sqllite3 = require('sqlite3').verbose();

const dbPath = 'database.db';

const db = new sqllite3.Database(dbPath, (error) => {
  if (error) {
    console.log('Failed on initialized database');
    return;
  }

  console.log('Connected to database');
});

module.exports = db;
