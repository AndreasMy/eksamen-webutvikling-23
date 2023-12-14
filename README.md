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

| Folder   | Contents                                      | Description                                                                                                              |
| -------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Routes   | loginRoutes.js, postRoutes.js, usersRoutes.js | Handles endpoint routing for API requests, including user authentication and blog post management.                       |
| Models   | postTable.js, userTable.js                    | Manages data models and database operations, such as queries for posts and user data.                                    |
| Database | db.js, database.db                            | Contains the SQLite database setup and initializations. Responsible for creating a new database if absent.               |
| Helpers  | auth.js, errorHandler.js, routerFns.js        | Comprises helper functions and middleware for tasks like authentication, error handling, and database query abstraction. |

This modular approach allows for clear separation of concerns, making the codebase more manageable and easier to understand. Each module serves a distinct purpose, facilitating easier updates and potential future expansions.

### 3.2. Endpoint design

The API endpoints are designed following RESTful principles, ensuring intuitive and predictable URL patterns:

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

These endpoints provide a comprehensive interface for CRUD operations (Create, Read, Update, Delete) that interact with the frontend. The RESTful design ensures that each endpoint performs a specific task, enhancing the API's usability and maintainability.

### 3.3. Database interaction

Database interactions are handled using SQL queries.

| Operation     | Description                       | Implementation Details               |
| ------------- | --------------------------------- | ------------------------------------ |
| Create Post   | Adds a new post to the database.  | SQL INSERT operation in postTable.js |
| Update Post   | Modifies an existing post.        | SQL UPDATE operation in postTable.js |
| Delete Post   | Removes a post from the database. | SQL DELETE operation in postTable.js |
| Register User | Adds a new user to the database.  | SQL INSERT operation in userTable.js |

Database interactions are handled using SQL queries, providing a robust and efficient way to perform CRUD operations:

### 3.4. Helper functions

Various helper functions and middleware are used to streamline the application:

| Function           | Description                                                | Used In           |
| ------------------ | ---------------------------------------------------------- | ----------------- |
| bcryptHashPassword | Hashes user passwords for secure storage.                  | User registration |
| authenticateToken  | Middleware for token verification and user authentication. | Protected routes  |
| errorHandler       | Centralized error handling across the application.         | Global middleware |
| handleDBQuery      | Generic function for database querying.                    | Models            |

Include code snippets for the functions and their usage, explain your understanding of the theory behind them and the pros and cons of using them in a small scale project like this, and the value of practicing these method in perparation for future projects.

### 3.5. Error handling

A centralized approach to error handling is adopted, ensuring uniformity and ease of debugging:

| Method            | Description                                             | Scope             |
| ----------------- | ------------------------------------------------------- | ----------------- |
| errorHandler      | Middleware for catching and formatting error responses. | Global middleware |
| sendErrorResponse | Utility for sending consistent error responses.         | Used in routes    |
| handleSuccess     | Utility for sending consistent OK responses.            | Used in routes    |

Describe how the global middleware works, discuss the pros and cons of using utility functions for custom error and response messages.

### 3.6. Security Considerations

## 4 Academic Reflection

### Evaluation of Own Work

_Self-reflection on the strengths and weaknesses of the project._

### Guidance and Adjustment

_Reflection on how the work could have been improved with guidance._
