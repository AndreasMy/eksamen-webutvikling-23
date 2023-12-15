const db = require('../database/db');
const { v4: uuidv4 } = require('uuid');

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS registered_users (
            id TEXT PRIMARY KEY, 
            username TEXT,
            password TEXT,
            email TEXT,
            dateCreated TEXT
        )`,
    function (error) {
      error
        ? console.error(error.message)
        : console.log('Table created or already exists');
    }
  );
});

const insertUserIntoDB = (user) => {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const query = `INSERT INTO registered_users (id, username, password, email, dateCreated)
                VALUES (?, ?, ?, ?, ?)`;
    db.run(
      query,
      [id, user.username, user.password, user.email, user.dateCreated],
      function (error) {
        error ? reject(error) : resolve(id);
      }
    );
  });
};

module.exports = {
  insertUserIntoDB,
};
