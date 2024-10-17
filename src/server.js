const net = require('net');

const hndl = require('./hndl/hndlCmds');

const server = net.createServer((socket) => {
  socket.write('220 Welcome to Node.js FTP Server\r\n');

  class connect {
    user = null;
    currentDir = null; 

    auditSocket = null;
    socket = socket; 

    cmd = null;
    args = null;
  }

  const c = new connect();

  socket.on('data', (data) => {
    const command = data.toString().trim();
    [c.cmd, ...c.args] = command.split(' ');

    hndl[c.cmd] === undefined ? c.socket.write('502 \r\n') : hndl[c.cmd].call(c);
  })

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

server.listen(3000, '192.168.0.11', () => {
  console.log('FTP server is running on port 3000');
});
