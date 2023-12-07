const db = require('../database/db');
const { v4: uuidv4 } = require('uuid');

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS blog_posts (
        id TEXT PRIMARY KEY,
        title TEXT,
        content TEXT,
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
    db.run(query, [id, post.title, post.content, post.datePosted], (err) => {
      err ? reject(err) : resolve(id);
    });
  });
};

const updatePostIntoTable = (post) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE blog_posts 
                   SET title = ?, content = ?, datePosted = ?
                   WHERE id = ?`;
    db.run(
      query,
      [post.title, post.content, post.datePosted, post.id],
      (err) => {
        err ? reject(err) : resolve(post);
      }
    );
  });
};

const deletePostFromTable = (post) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM blog_posts WHERE id = ?`;
    db.run(query, [post.id], (err) => {
      err ? reject(err) : resolve(post);
    });
  });
};

module.exports = {
  insertPostIntoTable,
  updatePostIntoTable,
  deletePostFromTable,
};
