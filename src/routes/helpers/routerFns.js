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

/*
  // Usage
  router.delete('/deleteUsers', async (req, res) => {
    executeDbCommand(
      req, 
      res, 
      'DELETE FROM registered_users', 
      [], 
      'All users deleted successfully'
    );
  });
 */
module.exports = { handleDBQuery, executeDbCommand };
