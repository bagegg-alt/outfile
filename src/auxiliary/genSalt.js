const crypto = require('crypto');

module.exports = () => {
  length = 32;
  return crypto.randomBytes(length).toString('hex');
}
