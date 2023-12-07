const db = require('../database/db');
const uuidv4 = require('uuidv4');

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS blog_posts (
        id TEXT PRIMARY KEY
        title TEXT
        content TEXT
        datePosted TEXT
    )`,
    (err) =>
      err
        ? console.error(err.message)
        : console.log('Table created or already exists')
  );
});

const insertPostIntoTable = (post) => {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const query = `INSERT INTO blog_posts (id, title, content, datePosted)
        VALUES (?, ?, ?, ?)`;
    db.run(query, [id, post.title, post.content, post.dateCreated]);
    err = err ? reject(err) : resolve(id);
  });
};

module.exports = {
  insertPostIntoTable,
};
