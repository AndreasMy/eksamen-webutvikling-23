const db = require('../database/db');

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY,
        userId TEXT,
        title TEXT,
        content TEXT,
        datePosted TEXT
    )`,
    function (error) {
      error
        ? console.erroror(error.message)
        : console.log('Table created or already exists');
    }
  );
});

const insertPostIntoTable = (post) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO blog_posts (userId, title, content, datePosted)
        VALUES (?, ?, ?, ?)`;
    db.run(
      query,
      [post.userId, post.title, post.content, post.datePosted],
      function (error) {
        if (error) {
          reject(error);
          return;
        }
        resolve(this.lastID); 
      }
    );
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
      function (error) {
        error ? reject(error) : resolve(post);
      }
    );
  });
};

const deletePostFromTable = (id) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM blog_posts WHERE id = ?`;
    db.run(query, [id], function (error) {
      error ? reject(error) : resolve(id);
    });
  });
};

module.exports = {
  insertPostIntoTable,
  updatePostIntoTable,
  deletePostFromTable,
};
