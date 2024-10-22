const net = require('net');
const tls = require('tls');

module.exports = {
  cmd: 'EPSV',
  hndl: function() {
    const passivePort = Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024;

    const dataSocket = net.createServer((dataSocket) => {
      const secureSocket = require('../../tlsSock.js')(dataSocket);
      
      this.auditSocket = secureSocket.on('connection', (client) => {

      });
    });

    dataSocket.listen(passivePort, () => {
      this.socket.write(`229 Entering Extended Passive Mode (|||${passivePort}|).\r\n`);
    });
  }
}
