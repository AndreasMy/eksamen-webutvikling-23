# Project Documentation

## Table of contents

- [1. Introduction](#1Introduction)
- [2. Installation](#2Installation)
- [3 Process and Development](#3-process-and-development)
- [4. Database](#4database)
- [5. Academic Reflection](#5academic-reflection)

## 1. Introduction

### 1.1. Brief

This is my submission for a school assignment, where I was tasked to build a CRUD backend for a simple blog webpage.

### 1.2. Note on folder structure

The assignment was initially provided with a single page template, ready with predefined endpoints. Opting for a modular approach, I restructured the project to enhance its maintainabilit and scalability. This structure not only facilitates ease of development but also allowed me to learn practices such as centralized error handling and the use of generic helper functions for database interactions.

### 1.3. Note on .env usage

Explain why .env is included in the git repository, the security risk of doing so and best practices for handling .env in production.

### 1.3. Built with

    - nodeJS
    - Express
    - sqLite
    - bCrypt
    - cors
    - cookie-parser
    - jsonwebtoken

## 2 Installation

### Cloning the Project

```bash
git clone https://github.com/AndreasMy/eksamen-webutvikling-23.git
```

### Installing the Project

```bash
npm install
```

### Running the Project

```bash
npm run start
```

## 3 Process and Development

_Describe the key points of the project_

### 3.1. Module structure

The project adopts a modular architecture, dividing the codebase into logical sections for ease of maintenance and scalability:
The project is modularized into the follwing folders:

| Folder   | Description                                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------------------------------ |
| Routes   | Handles endpoint routing for API requests, including user authentication and blog post management.                       |
| Models   | Manages data models and database operations, such as queries for posts and user data.                                    |
| Database | Contains the SQLite database setup and initializations. Responsible for creating a new database if absent.               |
| Helpers  | Comprises helper functions and middleware for tasks like authentication, error handling, and database query abstraction. |

---

This modular approach allows for clear separation of concerns, making the codebase more manageable and easier to understand. Each module serves a distinct purpose, facilitating easier updates and potential future expansions.

Say something abut express Router and how endpoint paths could have been improved if we were allowed to work with the frontend code.

---

### 3.2. Endpoint design

The API endpoints are designed following RESTful principles. These endpoints provide a comprehensive interface for CRUD operations (Create, Read, Update, Delete) that interact with the frontend.

| Endpoint   | HTTP Method | Description                           | Used in        |
| ---------- | ----------- | ------------------------------------- | -------------- |
| /posts     | GET         | Retrieves all blog posts.             | postRoutes.js  |
| /posts/:id | GET         | Retrieves a specific blog post by ID. | postRoutes.js  |
| /posts     | POST        | Creates a new blog post.              | postRoutes.js  |
| /posts/:id | PUT         | Updates an existing blog post by ID.  | postRoutes.js  |
| /posts/:id | DELETE      | Deletes a blog post by ID.            | postRoutes.js  |
| /users     | POST        | Registers a new user.                 | userRoutes.js  |
| /login     | POST        | Authenticates a user.                 | loginRoutes.js |
| /logout    | POST        | Logs out a user.                      | loginRoutes.js |

**Route handler patterns**

My goal was to make sure each endpoint handler followed a consistent, declarative pattern. I did my best to achieve this by using utility functions and middleware to handle repetitive tasks.

All endpoint handlers are written in async and uses the try/catch codeblock to catch and handle errors. Exception errors are caught and formatted by a global [error handling](#35-error-handling) middleware. This ensures concise and readable error handling across the codebase.

**Example route handler:**

```javascript
router.post('/posts', authenticateToken, async (req, res, next) => {
  try {
    // ...req.body represents the parsed json sent from the client
    // req.user.id has been initialized in authenitcateToken
    const data = { ...req.body, userId: req.user.id };
    await insertPostIntoTable(data);
    return handleResponse(res, 200, 'Post created successfully');
  } catch (error) {
    console.error('Error creating post', error);
    // pass exception errors to errorHandler middleware
    next(error);
  }
});
```

---

### 3.3 Database interaction

Database interactions are handled using SQL queries, providing a robust and efficient way to perform CRUD operations.

| Operation     | Description                               | Implementation Details                       |
| ------------- | ----------------------------------------- | -------------------------------------------- |
| Create Post   | Adds a new post to the database.          | SQL INSERT operation in postTable.js         |
| Update Post   | Modifies an existing post.                | SQL UPDATE operation in postTable.js         |
| Delete Post   | Removes a post from the database.         | SQL DELETE operation in postTable.js         |
| Read Content  | Reads assigned content from the database. | SQL SELECT operation as generalized function |
| Register User | Adds a new user to the database.          | SQL INSERT operation in userTable.js         |

---

**Database queries and Promises**

All database query functions are written to return a promise. Promises are used to manage situations where the program must wait for the outcome of an operation.

The promise will be in pending mode until the execution of the query. Once the query execution completes, the Promise resolves with the affected data or a success confirmation if successful. In case of an error, the Promise is rejected and returns an error object. This error object is then handled in the route handler, and any uncaught exception errors are caught in the 'catch' block and passed to the errorHandler middleware for centralized error management.

Promises, particularly when used with async/await syntax, enhance readability and simplify error handling, providing a significant advantage over traditional callback-based approaches.

**Example:**

```javascript
const updatePostIntoTable = (post) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE blog_posts 
                   SET title = ?, content = ?, datePosted = ?
                   WHERE id = ?`;
    db.run(
      query,
      [post.title, post.content, post.datePosted, post.id],
      function (error) {
        // In case of an error, reject the promise
        // On successful query execution, resolve the promise
        error ? reject(error) : resolve(post);
      }
    );
  });
};
```

**Database Requirements**

We were assigned to adhere to the following structure:

- **Users Table** should contain:

  > id, username, password, email and dateCreated.

- **Posts Table** should contain:

  > id, userId, title, content and datePosted.

  ***

To meet the client's requirement for including a username in the response of the GET /posts endpoint, the code matches posts.userId with user.id. A new 'username' property is added to every post before sending the response.

**Example:**

```javascript
// Example: Adding username to each post to use in the GET /posts endpoint
// Returns a single object containing id and username as a key/val pair
const getPostsAndUsernames = async (next) => {
  try {
    // Database queries are chained asynchronously as promises
    const posts = await handleDBQuery('SELECT * FROM blog_posts');
    const users = await handleDBQuery('SELECT * FROM registered_users');

    const usernameMap = {};
    users.forEach((user) => {
      usernameMap[user.id] = user.username;
    });

    // Adds new property 'username' to every 'post' object
    const postsWithUsernames = posts.map((post) => ({
      ...post,
      username: usernameMap[post.userId] || 'Unknown user',
    }));

    return postsWithUsernames;
  } catch (error) {
    console.error('Error in getPostsAndUsernames:', error);
    throw error; // Rethrow error for centralized handling
  }
};
```

**Usage in route handler:**

```javascript
router.get('/posts', async (req, res, next) => {
  try {
    const postsWithUsernames = await getPostsAndUsernames();
    res.json(postsWithUsernames);
  } catch (error) {
    console.error('Error fetching posts', error);
    next(error); // Pass error to errorHandler middleware
  }
});
```

**Note on using numeric id vs uuid**
Initially, I used uuidv4 for both database tables, but quickly realized that the front end code expected a numeric id. The post table therefore uses numeric IDs while the users table still use uuid.

### 3.4 Helper functions

Various helper functions and middleware are used to streamline the application:

| Function        | Description                                | Scope/Used in |
| --------------- | ------------------------------------------ | ------------- |
| handleDBQuery   | Generic function for database querying.    | Models        |
| getAllUserNames | Adds username to json requested by client. | GET /posts    |

**handleDBQuery:** 

Serves as a centralized database query handler. It abstracts the intricacies of executing SQL queries, allowing other parts of the application to interact with the database without concerning themselves with the underlying database connection details. The use of promisesprovides cleaner error handling and improved flow control compared to traditional callback-based approaches.

**Example:**

```javascript
// Centralized handler for all SELECT queries
// singleItem defaults to false
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
```

**Usage:**

```javascript
// Selecting all posts
const posts = await handleDBQuery('SELECT * FROM blog_posts');
```

```javascript
// For selecting post by id
// singleItem parameter is set to 'true',
const selectPostById = await handleDBQuery(
  'SELECT * FROM blog_posts WHERE id = ?',
  [id],
  true
);
```

### 3.5. Error handling

A centralized approach to error handling is adopted, ensuring uniformity and ease of debugging:

| Method            | Description                                             | Scope             |
| ----------------- | ------------------------------------------------------- | ----------------- |
| errorHandler      | Middleware for catching and formatting error responses. | Global middleware |
| sendErrorResponse | Utility for sending consistent error responses.         | Used in routes    |
| handleResponse    | Utility for sending consistent OK responses.            | Used in routes    |

---

**errorHandler**

I tried to implement at centralized error handling approach, which streamlines error management by ensuring consistent handling and uniform response formats. It also aids in debugging by offering a single point for error tracking and logging. However, this method may sometimes limit granular control over error handling in different parts of the application, necessitating adjustments or bypassing the centralized system for specific scenarios.

**Example:**

```javascript
// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    // If headers are already sent, delegate to the default Express error handler
    return next(err);
  }
  res.status(err.status || 500).json({
    // Sets the HTTP status code and sends a JSON response
    error: {
      message: err.message || 'An unexpected error occurred',
      code: err.code || 'INTERNAL_SERVER_ERROR',
    },
  });
};
```

I used these utility functions to limit code repetition and foster more readable code in the route handlers. the use of these utilities might be a bit excessive in the context of this assignment and I might have introduced some unnecessary complexity here.

```javascript
// Utility function to send a standardized error response
const sendErrorResponse = (res, statusCode, message) => {
  // Sends a JSON response with a status code and message
  res.status(statusCode).json({ authenticated: false, message });
};

// Utility function to send a standardized success (OK) response
const handleResponse = (res, statusCode, message, object) => {
  res.status(statusCode).json({ message, object });
};
```

### 3.6. Security Middleware & Helpers

| Function              | Description                                                               | Scope/Used in       |
| --------------------- | ------------------------------------------------------------------------- | ------------------- |
| bcryptHashPassword    | Hashes user passwords for secure storage using bcrypt.                    | User registration   |
| bcryptComparePassword | Compares a plaintext password with a hashed password to validate a user.  | User authentication |
| authenticateToken     | Middleware for token verification and user authentication using JWT.      | Protected routes    |
| signJwtToken          | Generates a JWT (JSON Web Token) for user authentication.                 | User login          |
| setCookie             | Sets a cookie in the user's browser with the JWT for maintaining session. | After user login    |

---

**Brief:**

The following functions provide a comprehensive system for user registration, authentication, and session management. Each plays a specific role in ensuring that user credentials are handled securely and that only authenticated users can access protected routes.

**bcryptHashPassword:**

This function is used during user registration to securely hash user passwords before storing them in the database. It uses bcrypt to generate a salt and hash the password, and then calls insertUserIntoDB to store the user's data, including the hashed password.

**Example:**

```javascript
// Hashes a user's password for secure storage in the database
const bcryptHashPassword = async (data) => {
  const saltRounds = 10; // Number of rounds for generating the salt
  const password = data.password;

  return new Promise((resolve, reject) => {
    bcrypt
      .hash(password, saltRounds) // Generates a hashed password
      .then((hash) => {
        data.password = hash; // Replace the plaintext password with the hash
        return insertUserIntoDB(data); // Inserts the user data into the database
      })
      .then((userID) => resolve(userID)) // Resolves with the new user's ID
      .catch((err) => reject(err)); // In case of an error, reject the promise
  });
};
```

**bcryptComparePassword:**

Used during user login, this function compares a provided plaintext password with the hashed password stored in the database. It returns true if the passwords match, otherwise false.

```javascript
// Compares a provided plaintext password with a hashed password in the database
const bcryptComparePassword = async (password, user) => {
  try {
    const match = bcrypt.compare(password, user.password); // Compares the passwords
    return match; // Returns true if passwords match, false otherwise
  } catch (error) {
    throw new Error('Error validating password'); // Throws an error if comparison fails
  }
};
```

---

**authenticateToken:**

As a middleware, this function checks for a JWT in the request headers, verifies it, and, if valid, allows the request to proceed. It's used to protect routes that require user authentication.

**Example:**

```javascript
// Middleware for verifying JWT token in the request header
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Extracts the Authorization header
  const token = authHeader && authHeader.split(' ')[1]; // Retrieves the token from the header

  if (token == null) {
    return sendErrorResponse(
      res,
      401,
      'You must be logged in to perform this operation.'
    ); // Sends an error response if no token is found
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return sendErrorResponse(
        res,
        401,
        'You must be logged in to perform this operation.'
      ); // Sends an error response if token verification fails
    }

    req.user = user; // Attaches the user object to the request
    next(); // Proceeds to the next middleware or route handler
  });
};
```

---

**signJwtToken:**

After a successful login, this function generates a JWT, which is then used for user authentication in subsequent requests. The JWT contains user-specific data like id and username.

**Example:**

```javascript
// Generates a JWT for user authentication
const signJwtToken = (user) => {
  return (token = jwt.sign(
    { id: user.id, username: user.username }, // User data payload
    secretKey, // Secret key used to sign the token
    { expiresIn: '1h' } // Token expiration time
  ));
};
```

**setCookie:**

This function sets a cookie in the user's browser containing the JWT. This is useful for maintaining the user's session and authenticating subsequent requests.

```javascript
// Sets a cookie in the user's browser with the JWT
const setCookie = (res, token) => {
  res.cookie('token', token, {
    maxAge: 900000, // Cookie expiration time in milliseconds
    httpOnly: false, // Allows JavaScript access to the cookie
    secure: false, // For HTTPS set to true, false for HTTP
    sameSite: 'lax', // Lax same-site policy for the cookie
  });
};
```

---

## 4 Academic Reflection

### Evaluation of Own Work

I opted for a modular approact and aimed to abstract away code that would clutter the route handlers. The goal was to learn more about implementing best practices in building a basic, but expandable REST API with node, express and sqlite. The experience has significantly elevated my understanding of backend development and will serve as a solid foundation for future projects.

### Guidance and Adjustment

I struggled with premature optimization and abstracting of code, often opting for generalizing operations before I had completely solved the problem. This lead to unnecessary time spent on debugging, often struggling with the added complexities of the abstracted code. In the future, I'll emphasize problem solving before abstracting and make sure that I implement generalized solutions only if I have adequate experience and understanding of how my code operates and is executed.
