const crypto = require('crypto');

module.exports = (password, salt, dig = 256, keyLength = 32) => {
  return new Promise((resolve, reject) => {
    const iterations = 1000;
    const digest = `sha${dig}`;

    crypto.pbkdf2(password, salt, iterations, keyLength, digest, (err, derivedKey) => {
      if (err) {
        return reject(err);
      }
      resolve(derivedKey.toString('hex'));
    });
  });
}
