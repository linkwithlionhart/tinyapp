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

module.exports = { getUserByEmail };