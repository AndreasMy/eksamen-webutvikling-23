
const db = require('../database/db');

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


const getAllUserNames = async (next) => {
  try {
    users = await handleDBQuery('SELECT * FROM registered_users');
    const usernameMap = {};

    users.forEach((user) => {
      usernameMap[user.id] = user.username;
    });

    return usernameMap;
  } catch (error) {
    console.error('Error fetching username:', error);
    next(error); // Re-throw the error so it can be handled by the caller
  }
};

module.exports = {
  handleDBQuery,
  getAllUserNames,
};
