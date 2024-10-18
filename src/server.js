const net = require('net');

const hndl = require('./hndl/hndlCmds');

const c = new (require('./conn'));


const server = net.createServer((socket) => {

  const secureSocket = require('./tlsSock')(socket);

  c.socket = secureSocket;
  c.sock = socket;


  secureSocket.write('220 Welcome to the FTPS server\r\n');

  secureSocket.on('data', (data) => {
    const command = data.toString().trim();
    [c.cmd, ...c.args] = command.split(' ');

    hndl[c.cmd] === undefined ? c.socket.write('502 \r\n') : hndl[c.cmd].call(c);
  });

  secureSocket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

server.listen(3000, '192.168.0.11', () => {
  console.log('FTP server is running on port 3000');
});
