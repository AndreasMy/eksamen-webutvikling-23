const db = require('../../database/db');

const handleDBQuery = (sql, params, singleItem = false) => {
  return new Promise((resolve, reject) => {
    const queryCallback = (err, data) => {
      if (err) {
        reject('Error reading from database');
        return;
      }
      if (singleItem && !data) {
        reject('Item not found');
        return;
      }
      resolve(data);
    };

    if (singleItem) {
      db.get(sql, params, queryCallback);
    } else {
      db.all(sql, params, queryCallback);
    }
  });
};

const executeDbCommand = (
  req,
  res,
  sql,
  params,
  singleItem = false,
  successMessage
) => {
  const queryCallback = (data) => {
    db.run(sql, params, (err) => {
      if (err) {
        console.error('Database error', err.message);
        res.status(500).send('Database operation failed');
        return;
      }
      if (singleItem && !data) {
        res.status(404).send('Item not found');
        return;
      }
      res.status(200).send(successMessage);
    });
    if (singleItem) {
      db.get(sql, params, queryCallback);
    } else {
      db.run(sql, params, queryCallback);
    }
  };
};

module.exports = { handleDBQuery, executeDbCommand };
