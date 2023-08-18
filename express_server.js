const express = require('express');
const app = express();
const PORT = 8080; // default port 8080

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca", // key: shortURL, value: longURL
  "9sm5xK": "http://www.google.com"
};

// GET request to send a response to the client.
app.get('/', (req, res) => {
  res.send("Hello!");
});

// GET request to send JSON string representing the entire urlDatabase object.
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// GET request to send HTML code to the client.
app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});