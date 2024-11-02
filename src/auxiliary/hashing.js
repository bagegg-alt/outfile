const crypto = require('crypto');

module.exports = (password, salt) => {
  return new Promise((resolve, reject) => {
    const iterations = 1000;
    const keyLength = 64;
    const digest = 'sha512';

    crypto.pbkdf2(password, salt, iterations, keyLength, digest, (err, derivedKey) => {
      if (err) {
        return reject(err);
      }
      resolve(derivedKey.toString('hex'));
    });
  });
}
