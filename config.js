module.exports = {
  PORT: 8080,
  COOKIE_SESSION: {
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge: 24 * 60 * 60 * 1000,
  }
};
