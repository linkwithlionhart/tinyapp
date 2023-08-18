// Import required modules.
const express = require('express');
const app = express();

// Define default port for the server.
const PORT = 8080;

// Database to store shortURLs as keys and their corresponding longURLs as values.
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Configure the app to use EJS as the template engine.
app.set('view engine', 'ejs');

// Respond to the root route with a simple greeting.
app.get('/', (req, res) => {
  res.send("Hello!");
});

// Respond with the entire urlDatabase as a JSON object when requested.
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// Respond with an HTML page that displays all URLs in the urlDatabase.
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

// Respond with details about a specific short URL when provided its ID.
app.get('/urls/:id', (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

// Respond to the '/hello' route with a simple HTML greeting.
app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Start the server and listen on the defined port.
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
