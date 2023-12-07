const db = require('../../database/db');

const handleDBQuery = (req, res, sql, params, singleItem = false) => {
  const queryCallback = (err, data) => {
    if (err) {
      res.status(500).send('Error reading from database');
      return;
    }
    if (singleItem && !data) {
      res.status(404).send('Item not found');
      return;
    }
    res.json(data);
  };

  if (singleItem) {
    db.get(sql, params, queryCallback);
  } else {
    db.all(sql, params, queryCallback);
  }
};

module.exports = { handleDBQuery };
