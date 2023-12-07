const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');

// Opprett databasefilen
const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.error('Database connection error', error.message);
    throw error;
  }
  console.log('Connected to database at ', dbPath);
});


module.exports = db;