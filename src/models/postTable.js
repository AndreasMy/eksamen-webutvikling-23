const db = require('../database/db');

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY,
        userId TEXT,
        title TEXT,
        content TEXT,
        dateCreated TEXT
    )`,
    function (err) {
      err
        ? console.error(err.message)
        : console.log('Table created or already exists');
    }
  );
});

const insertPostIntoTable = (post) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO blog_posts (userId, title, content, dateCreated)
        VALUES (?, ?, ?, ?)`;
    db.run(
      query,
      [post.userId, post.title, post.content, post.dateCreated],
      function (err) {
        err ? reject(err) : resolve(this.lastId);
      }
    );
  });
};

const updatePostIntoTable = (post) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE blog_posts 
                   SET title = ?, content = ?, dateCreated = ?
                   WHERE id = ?`;
    db.run(
      query,
      [post.title, post.content, post.dateCreated, post.id],
      function (err) {
        err ? reject(err) : resolve(post);
      }
    );
  });
};

const deletePostFromTable = (id) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM blog_posts WHERE id = ?`;
    db.run(query, [id], function (err) {
      err ? reject(err) : resolve(id);
    });
  });
};

module.exports = {
  insertPostIntoTable,
  updatePostIntoTable,
  deletePostFromTable,
};
