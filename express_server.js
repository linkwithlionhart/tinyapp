// 1. Imports
// Import necessary modules.
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const bcrypt = require('bcryptjs');

// 2. Constants and Configuration
// Set the default port number for the server.
const PORT = 8080;

// 3. Middleware
// Middleware to parse incoming request bodies.
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Set EJS as the default template engine.
app.set('view engine', 'ejs');

// 4. Helper Functions
// Generate random 6-character string.
const generateRandomString = () => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    randomString += chars[Math.floor(Math.random() * chars.length)];
  }
  return randomString;
};
// Get user's ID.
const getUserByID = id => {
  return users[id];
}
// Fetch user based on email.
const getUserByEmail = email => {
  for (let userID in users) {
    if (users[userID].email === email) {
      return users[userID];
    }
  }
  return null;
};
// Fetch URLs that belong only to user.
const urlsForUser = id => {
  let userURLs = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userURLs[shortURL] = urlDatabase[shortURL];
    }
  }
  return userURLs;
}

// 5. Databases and Other Global Data Structures
// Database to store shortURLs as keys and their corresponding longURLs as values.
const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID",
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID",
  },
};

// Database to store users and their related information.
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

// 6. Routes
// Root greeting route.
app.get('/', (req, res) => {
  res.send("Hello!");
});

// Simple HTML greeting route.
app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Return URL database as JSON.
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// Display all stored URLs.
app.get('/urls', (req, res) => {
  const userID = req.cookies['user_id'];
  const user = getUserByID(userID);
  if (!user) {
    return res.send("Please log in or register to view URLs.");
  }
  const userURLs = urlsForUser(userID);
  const templateVars = { 
    user: user,
    urls: userURLs 
  };
  res.render('urls_index', templateVars);
});

// Display form to create new URL.
app.get('/urls/new', (req, res) => {
  const user = getUserByID(req.cookies['user_id']);
  const templateVars = {
    user: user,
  }
  if (!user) {
    return res.redirect('/login');
  }
  res.render('urls_new', templateVars);
});

// Show details of a specific short URL.
app.get('/urls/:id', (req, res) => {
  const userID = getUserByID(req.cookies['user_id']);
  const user = getUserByID(userID);
  const shortURL = req.params.id;
  if (!user) {
    return res.send("Please log in to view URL details.");
  }
  if (!urlDatabase[shortURL]) {
    return res.status(404).send("Short URL not found.");
  }
  if (urlDatabase[shortURL].userID !== userID) {
    return res.status(403).send("This URL does not belong to you!");
  }
  const templateVars = { 
    user: user,
    id: shortURL, 
    longURL: urlDatabase[shortURL].longURL,
  };
  res.render("urls_show", templateVars);
});

// Redirect from short URL to its corresponding long URL.
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id].longURL;
  if (!longURL) {
    return res.status(404).send("Short URL not found!");
  }
  res.redirect(longURL);
});

// Route to login page.
app.get('/login', (req, res) => {
  // Fetch the user based on the user_id cookie.
  const user = getUserByID(req.cookies['user_id']); 
  const templateVars = {
    user: user
  }
  // Redirect to '/urls' when logged in.
  if (user) {
    return res.redirect('/urls');
  }
  res.render('login', templateVars);
});

// Route to registration.
app.get('/register', (req, res) => {
  // Fetch the user based on the user_id cookie.
  const user = getUserByID(req.cookies['user_id']); 
  const templateVars = {
    user: user
  }
  // Redirect to '/urls' when logged in.
  if (user) {
    return res.redirect('/urls');
  }
  res.render('register', templateVars);
});

// Registration handler: Route to registration endpoint that handles registration form data.
app.post('/register', (req, res) => {
  // Extract email and password from request body.
  const { email, password } = req.body;
  // Check if email and password are provided.
  if (!email || !password) {
    return res.status(400).send('You must provide both an email and a password.');
  }
  // Check if user with email already exists.
  for (let userID in users) {
    if (users[userID].email === email) {
      return res.status(400).send("Email already exists. Proceed to login or try again.")
    }
  }
  // Generate random ID for user.
  const id = generateRandomString();
  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);
  // Create new user object.
  users[id] = {
    id, 
    email,
    password: hashedPassword,
  }
  // Set user id cookie
  res.cookie('user_id', id);
  // Redirect to /urls
  res.redirect('/urls');
  console.log(users); // debugging
});

// Route login endpoint to set the user cookie and redirect.
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Find user based on email.
  const user = getUserByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(403).send("Email or password is incorrect.");
  }
  // On successful login, set user_id cookie and redirect to '/urls'
  res.cookie('user_id', user.id);
  res.redirect('/urls');
});

// Route logout endpoint to clear the user cookie and redirect to '/urls'
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});

// Add new short and long URL to the database.
app.post('/urls', (req, res) => {
  // Redirect users not logged in.
  const userID = getUserByID(req.cookies['user_id']);
  const user = getUserByID(userID);
  if (!user) {
    return res.status(403).send("You must be logged in to shorten a URL.");
  }
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID,
  }
  res.redirect(`/urls/${shortURL}`);
});

// Update a specific short URL's corresponding long URL.
app.post('/urls/:id/update', (req, res) => {
  const userID = req.cookies['user_id'];
  const user = getUserByID(userID);
  const shortURL = req.params.id;
  // Redirect users not logged in.
  if (!user) {
    return res.status(403).send("You must be logged in to edit long URLs.");
  }
  if (!urlDatabase[shortURL]) {
    return res.status(404).send("Short URL not found.");
  }
  if (urlDatabase[shortURL].userID !== userID) {
    return res.status(403).send("You cannot update an URL that does not belong to you.");
  }
  urlDatabase[shortURL].longURL = req.body.updatedLongURL;
  res.redirect('/urls');  
});

// Delete a short URL from the database.
app.post('/urls/:id/delete', (req, res) => {
  const userID = req.cookies['user_id'];
  const user = getUserByID(userID);
  const shortURL = req.params.id;
  // Redirect users not logged in.
  if (!user) {
    return res.status(400).send("You must be logged in to delete URLs.");
  }
  if (!urlDatabase[shortURL]) {
    return res.status(404).send("Short URL not found");
  }
  if (urlDatabase[shortURL].userID !== userID) {
    return res.status(403).send("You cannot an URL that does not belong to you.");
  }
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

// 7. Server Initialization
// Start the server.
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});
