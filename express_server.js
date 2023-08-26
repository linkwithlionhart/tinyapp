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

// 5. Databases and Other Global Data Structures
// Database to store shortURLs as keys and their corresponding longURLs as values.
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Database to store users and their related information.
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
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
  const user = getUserByID(req.cookies['user_id']);
  const templateVars = { 
    user: user,
    urls: urlDatabase };
  res.render('urls_index', templateVars);
});

// Display form to create new URL.
app.get('/urls/new', (req, res) => {
  const user = getUserByID(req.cookies['user_id']);
  const templateVars = {
    user: user
  }
  res.render('urls_new', templateVars);
});

// Show details of a specific short URL.
app.get('/urls/:id', (req, res) => {
  const user = getUserByID(req.cookies['user_id']);
  const templateVars = { 
    user: user,
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

// Route to registration.
app.get('/register', (req, res) => {
  const user = getUserByID(req.cookies['user_id']); // Fetch the user based on the user_id cookie.
  const templateVars = {
    user: user
  }
  res.render('register', templateVars);
});

// Route to login page.
app.get('/login', (req, res) => {
  const user = getUserByID(req.cookies['user_id']); // Fetch the user based on the user_id cookie.
  const templateVars = {
    user: user
  }
  res.render('login', templateVars);
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
  // Create new user object.
  users[id] = {
    id, 
    email,
    password
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
  if (!user || user.password !== password) {
    return res.status(403).send("Email or password incorrect.");
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
