const bcrypt = require('bcryptjs');

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID",
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID",
  },
  "mku007": {
    longURL: "https://fireship.io/",
    userID: "user3RandomID",
  },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10),
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10),
  },
  user3RandomID: {
    id: "user3RandomID",
    email: "test@test.ca",
    password: bcrypt.hashSync("test", 10),
  },
};

module.exports = {
  urlDatabase,
  users
};
