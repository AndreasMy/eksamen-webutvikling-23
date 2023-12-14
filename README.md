# Project Documentation

## Table of contents

- [1. Introduction](#Introduction)
- [2. Installation](#Installation)
- [3. Process and Development](#process-and-development)
- [4. Database](#database)
- [5. Academic Reflection](#academic-reflection)

## 1. Introduction

### 1.1. Brief

This is my submission for a school assignment, where I was tasked to build a CRUD backend for a simple blog webpage.

### 1.2. Note on folder structure

The assignment was initially provided with a single page template, ready with predefined endpoints. Opting for a modular approach, I restructured the project to enhance its maintainabilit and scalability. This structure not only facilitates ease of development but also allowed me to learn practices such as centralized error handling and the use of generic helper functions for database interactions.

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

The project is modularized into the follwing folders:

| Folder       | Files                                | Description                                                                                                                          |
| ------------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Routes**   | loginRoutes, postRoutes, usersRoutes | Contains all the endpoint routes, handling various API requests.                                                                     |
| **Models**   | postTable, userTable                 | Handles database serialization and database operations.                                                                              |
| **Database** | db, database.db                      | Manages the SQLite database. Creates a new database if not present.                                                                  |
| **Helpers**  | auth, errorHandler, routerFns        | Includes helper functions and middlewares for authentication, centralized error handling, and functions that reduce code repetition. |

### 3.2. Endpoint design

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

### 3.3. Helper functions

| Function           | Description                                                | Used In           |
| ------------------ | ---------------------------------------------------------- | ----------------- |
| bcryptHashPassword | Hashes user passwords for secure storage.                  | User registration |
| authenticateToken  | Middleware for token verification and user authentication. | Protected routes  |
| errorHandler       | Centralized error handling across the application.         | Global middleware |
| handleDBQuery      | Generic function for database querying.                    | Models            |

### 3.4. Database interaction

| Operation     | Description                       | Implementation Details               |
| ------------- | --------------------------------- | ------------------------------------ |
| Create Post   | Adds a new post to the database.  | SQL INSERT operation in postTable.js |
| Update Post   | Modifies an existing post.        | SQL UPDATE operation in postTable.js |
| Delete Post   | Removes a post from the database. | SQL DELETE operation in postTable.js |
| Register User | Adds a new user to the database.  | SQL INSERT operation in userTable.js |

### 3.5. Error handling

| Method            | Description                                             | Scope             |
| ----------------- | ------------------------------------------------------- | ----------------- |
| errorHandler      | Middleware for catching and formatting error responses. | Global middleware |
| sendErrorResponse | Utility for sending consistent error responses.         | Used in routes    |
| handleSuccess     | Utility for sending consistent OK responses.            | Used in routes    |

### 3.6. Security Considerations

## 4 Academic Reflection

### Evaluation of Own Work

_Self-reflection on the strengths and weaknesses of the project._

### Guidance and Adjustment

_Reflection on how the work could have been improved with guidance._
