const net = require('net');

const hndl = require('./hndl/hndlCmds');
const mongo = require('./models/db.js');


const server = net.createServer((socket) => {
  const secureSocket = require('./tlsSock')(socket);

  const c = new (require('./conn'));

  c.socket = secureSocket;
  c.sock = socket;
  c.mongo = mongo;

  secureSocket.write('220 Welcome to the FTPS server\r\n');

  secureSocket.on('data', async (data) => {
    const command = data.toString().trim();
    [c.cmd, ...c.args] = command.split(' ');
    c.cmd = c.cmd.toUpperCase();

    hndl[c.cmd] === undefined ? c.socket.write('502 \r\n') : await hndl[c.cmd].call(c);
  });

  secureSocket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

server.listen(3000, '192.168.0.12', () => {
  mongo.start();

  console.log('FTP server is running on port 3000');
});
