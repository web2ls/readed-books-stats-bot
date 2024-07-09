const sqllite3 = require('sqlite3').verbose();

const db = new sqllite3.Database(process.env.DB_FILE_NAME, (error) => {
  if (error) {
    console.log('Failed on initialized database');
    return;
  }

  console.log('Connected to database');
});

module.exports = db;
