/**
 * Fetches a user from the database based on the email provided.
 * @param {string} email - User's email to search for.
 * @param {Object} database - Database containing user details.
 * @returns {(Object|null)} Returns user object if found; otherwise, null.
 */
const getUserByEmail = (email, database) => {
  for (let userID in database) {
    if (database[userID].email === email) {
      return database[userID];
    }
  }
  return null;
};

/**
 * Generates a random string of 6 characters using alphanumeric characters.
 * @returns {string} A randomly generated string.
 */
const generateRandomString = () => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    randomString += chars[Math.floor(Math.random() * chars.length)];
  }
  return randomString;
};

/**
 * Retrieves a user object from the users database using the given ID.
 * @param {string} id - The ID of the user to be retrieved.
 * @returns {object} The user object, or undefined if the user with the given ID does not exist.
 */
const getUserByID = (id, users) => {
  return users[id];
};

/**
 * Retrieves all URLs associated with a specific user ID from the URL database.
 * @param {string} id - The ID of the user whose URLs are to be retrieved.
 * @returns {object} An object containing all the short URLs associated with the user and their details.
 */
const urlsForUser = (id, urlDatabase) => {
  let userURLs = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userURLs[shortURL] = urlDatabase[shortURL];
    }
  }
  return userURLs;
};

module.exports = { 
  getUserByEmail, 
  generateRandomString, 
  getUserByID,
  urlsForUser,
};