# TinyApp Project

TinyApp is a full-stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

![My URLs page.](https://github.com/linkwithlionhart/tinyapp/blob/main/docs/urls-page.png?raw=true)
![Login page.](https://github.com/linkwithlionhart/tinyapp/blob/main/docs/login-page.png?raw=true)
![Edit URL page.](https://github.com/linkwithlionhart/tinyapp/blob/main/docs/edit-url-page.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session
- morgan

## Getting Started
- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Open your browser and go to `http://localhost:8080/` to start shortening URLs.

## Features

### User Registration & Authentication

- User registration with email verification (ensure no duplicate users).
- Secure password hashing with bcryptjs.
- User authentication for URL creation, editing, and deletion.

### URL Management

- Create new short URLs.
- View a list of all personal URLs.
- Edit existing URLs.
- Delete URLs.

## File Structure

- Main server file: `express_server.js`
- Configuration: `config.js`
- Data: `data.js`
- Helper functions: `helpers.js`
- Views (EJS templates): 
  - Login page: `views/login.ejs`
  - Registration page: `views/register.ejs`
  - URL index page: `views/urls_index.ejs`
  - New URL page: `views/urls_new.ejs`
  - Show URL details page: `views/urls_show.ejs`
  - Header partial: `views/partials/_header.ejs`

### Helper Functions

- `getUserByEmail(email, database)`: Fetches a user from the database based on the email provided.
- `generateRandomString()`: Generates a random string of 6 characters using alphanumeric characters.
- `getUserByID(id, users)`: Retrieves a user object from the users' database using the given ID.
- `urlsForUser(id, urlDatabase)`: Retrieves all URLs associated with a specific user ID from the URL database.

## Testing

- Test cases available in `test/helpersTest.js`.

## Feedback & Issues

Feel free to [file an issue](https://github.com/linkwithlionhart/tinyapp/issues) for feedback or bug reporting.
