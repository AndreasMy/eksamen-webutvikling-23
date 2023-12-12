const express = require('express');
const db = require("../database/db");

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

module.exports = { handleDBQuery };
