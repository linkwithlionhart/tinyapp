// 1. Imports
// Import necessary modules.
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// 2. Constants and Configuration
// Set the default port number for the server.
const PORT = 8080;

// 3. Middleware
// Middleware to parse incoming request bodies.
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set EJS as the default template engine.
app.set('view engine', 'ejs');

// 4. Utility Functions
// Utility function to generate random 6-character string.
const generateRandomString = () => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    randomString += chars[Math.floor(Math.random() * chars.length)];
  }
  return randomString;
};

// 5. Databases and Other Global Data Structures
// Database to store shortURLs as keys and their corresponding longURLs as values.
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// 6. Routes
// Root greeting route.
app.get('/', (req, res) => {
  res.send("Hello!");
});

// Return URL database as JSON.
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// Simple HTML greeting route.
app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Display all stored URLs.
app.get('/urls', (req, res) => {
  const templateVars = { 
    username: req.cookies['username'],
    urls: urlDatabase };
  res.render('urls_index', templateVars);
});

// Display form to create new URL.
app.get('/urls/new', (req, res) => {
  const templateVars = {
    username: req.cookies['username']
  }
  res.render('urls_new', templateVars);
});

// Show details of a specific short URL.
app.get('/urls/:id', (req, res) => {
  const templateVars = { 
    username: req.cookies['username'],
    id: req.params.id, 
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});

// Redirect from short URL to its corresponding long URL.
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send("Short URL not found!");
  }
});

// Login route to set the username cookie and redirect.
app.post('/login', (req, res) => {
  const username = req.body.username;
  // Set cookie named 'username' with the provided input.
  res.cookie('username', username);
  // Redirect the user back to '/urls' page.
  res.redirect('/urls');
});

// Logout route to clear the username cookie and redirect to '/urls'
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

// Add new short and long URL to the database.
app.post('/urls', (req, res) => {
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls/${id}`);
});

// Update a specific short URL's corresponding long URL.
app.post('/urls/:id', (req, res) => {
  const id = req.params.id;
  const newLongURL = req.body.updatedLongURL;
  // Check if short URL id exists in database.
  if (urlDatabase[id]) {
    urlDatabase[id] = newLongURL;
    res.redirect('/urls');
  } else {
    res.status(404).send("Short URL not found!");
  }
});

// Delete a short URL from the database.
app.post('/urls/:id/delete', (req, res) => {
  const id = req.params.id;
  if (urlDatabase[id]) {
    delete urlDatabase[id];
    res.redirect('/urls');
  } else {
    res.status(404).send("Short URL not found!");
  }
});

// 7. Server Initialization
// Start the server.
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});
