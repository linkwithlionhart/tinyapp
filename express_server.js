// Import necessary modules.
const express = require('express');
const app = express();

// Set the default port number for the server.
const PORT = 8080;

// Middleware to parse incoming request bodies.
app.use(express.urlencoded({ extended: true }));

// Set EJS as the default template engine.
app.set('view engine', 'ejs');

// Database to store shortURLs as keys and their corresponding longURLs as values.
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Utility function to generate random 6-character string.
const generateRandomString = () => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    randomString += chars[Math.floor(Math.random() * chars.length)];
  }
  return randomString;
};

// Root greeting route.
app.get('/', (req, res) => {
  res.send("Hello!");
});

// Return URL database as JSON.
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// Display form to create new URL.
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

// Display all stored URLs.
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
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

// Add new short and long URL to the database.
app.post('/urls', (req, res) => {
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls/${id}`);
});

// Show details of a specific short URL.
app.get('/urls/:id', (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
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

// Simple HTML greeting route.
app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Start the server.
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});
