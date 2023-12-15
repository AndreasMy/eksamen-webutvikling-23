
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

const getPostsAndUsernames = async (next) => {
  try {
    const posts = await handleDBQuery('SELECT * FROM blog_posts');
    const users = await handleDBQuery('SELECT * FROM registered_users');

    const usernameMap = {};
    users.forEach((user) => {
      usernameMap[user.id] = user.username;
    });

    // Assign username to each post
    const postsWithUsernames = posts.map((post) => ({
      ...post,
      username: usernameMap[post.userId] || 'Unknown user',
    }));

    return postsWithUsernames;
  } catch (error) {
    console.error('Error in getPostsAndUsernames:', error);
    throw error; 
  }
};

module.exports = {
  getPostsAndUsernames,
  handleDBQuery,
};
