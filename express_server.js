/**
 * TinyApp server implementation.
 * Organized into sections:
 * 1. Imports & Constants
 * 2. Middleware Configuration
 * 3. GET Routes
 * 4. POST Routes
 * 5. Server Initialization
 */

// 1. Imports & Constants
const express = require('express');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const morgan = require('morgan');
const app = express();
const { PORT, COOKIE_SESSION } = require('./config');
const { urlDatabase, users } = require('./data');
const { 
  getUserByEmail, 
  generateRandomString, 
  getUserByID,
  urlsForUser 
} = require('./helpers');

// 2. Middleware Configuration
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession(COOKIE_SESSION));
app.use(morgan('dev'));
app.set('view engine', 'ejs');

// 3. GET Routes
app.get('/', (req, res) => {
  res.send("Hello!");
});

app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => {
  const user = getUserByID(req.session.user_id, users);
  if (!user) {
    return res.send("Please log in or register to view URLs.");
  }
  const userURLs = urlsForUser(user.id, urlDatabase);
  const templateVars = { 
    user: user,
    urls: userURLs,
  };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const user = getUserByID(req.session.user_id, users);
  const templateVars = {
    user: user,
  }
  if (!user) {
    return res.redirect('/login');
  }
  res.render('urls_new', templateVars);
});

app.get('/urls/:id', (req, res) => {
  const user = getUserByID(req.session.user_id, users);
  const shortURL = req.params.id;
  if (!user) {
    return res.send("Please log in to view URL details.");
  }
  if (!urlDatabase[shortURL]) {
    return res.status(404).send("Short URL not found.");
  }
  if (urlDatabase[shortURL].userID !== user.id) {
    return res.status(403).send("This URL does not belong to you!");
  }
  const templateVars = { 
    user: user,
    id: shortURL, 
    longURL: urlDatabase[shortURL].longURL,
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id].longURL;
  if (!longURL) {
    return res.status(404).send("Short URL not found!");
  }
  res.redirect(longURL);
});

app.get('/login', (req, res) => {
  const user = getUserByID(req.session.user_id, users); 
  const templateVars = {
    user: user,
  }
  if (user) {
    return res.redirect('/urls');
  }
  res.render('login', templateVars);
});

app.get('/register', (req, res) => {
  const user = getUserByID(req.session.user_id, users); 
  const templateVars = {
    user: user,
  }
  if (user) {
    return res.redirect('/urls');
  }
  res.render('register', templateVars);
});

// 4. POST Routes
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('You must provide both an email and a password.');
  }
  const existingUser = getUserByEmail(email, users);
  if (existingUser) {
    return res.status(400).send("Email already exists. Proceed to login or try again.");
  }
  const id = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10);
  users[id] = {
    id, 
    email,
    password: hashedPassword,
  }
  req.session.user_id = id;
  res.redirect('/urls');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email, users);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(403).send("Email or password is incorrect.");
  }
  req.session.user_id = user.id;
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  delete req.session.user_id;
  res.redirect('/login');
});

app.post('/urls', (req, res) => {
  const user = getUserByID(req.session.user_id, users);
  if (!user) {
    return res.status(403).send("You must be logged in to shorten a URL.");
  }
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: user.id,
  }
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:id/update', (req, res) => {
  const user = getUserByID(req.session.user_id, users);
  const shortURL = req.params.id;
  if (!user) {
    return res.status(403).send("You must be logged in to edit long URLs.");
  }
  if (!urlDatabase[shortURL]) {
    return res.status(404).send("Short URL not found.");
  }
  if (urlDatabase[shortURL].userID !== user.id) {
    return res.status(403).send("You cannot update an URL that does not belong to you.");
  }
  urlDatabase[shortURL].longURL = req.body.updatedLongURL;
  res.redirect('/urls');  
});

app.post('/urls/:id/delete', (req, res) => {
  const user = getUserByID(req.session.user_id, users);
  const shortURL = req.params.id;
  if (!user) {
    return res.status(400).send("You must be logged in to delete URLs.");
  }
  if (!urlDatabase[shortURL]) {
    return res.status(404).send("Short URL not found");
  }
  if (urlDatabase[shortURL].userID !== user.id) {
    return res.status(403).send("You cannot delete an URL that does not belong to you.");
  }
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

// 5. Server Initialization
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});
