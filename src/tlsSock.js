const tls = require('tls');

const fs = require('fs');
const path = require('path');

const options = {
    key: fs.readFileSync(path.join('..', 'tls', 'private.key')),
    cert: fs.readFileSync(path.join('..', 'tls', 'certificate.crt'))
};

module.exports = (socket) => {
  return new tls.TLSSocket(socket, {
    ...options,
    isServer: true,
    secureContext: tls.createSecureContext(options)
  });
}
