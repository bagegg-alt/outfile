const net = require('net');
const fs = require('fs');
const path = require('path');

const server = net.createServer((socket) => {
  let currentDir = '/';

  let user = null;

  let passivePort = null;
  let dataSocket = null;
  let auditPort = null;

  socket.write('220 Welcome to Node.js FTP Server\r\n');

  socket.on('data', (data) => {
    const command = data.toString().trim();
    const [cmd, arg] = command.split(' ');

    switch (cmd.toUpperCase()) {
      case 'USER':
        user = arg;
        socket.write('331 User name okay, need password.\r\n');
        break;
      case 'PASS':
        socket.write('230 User logged in, proceed.\r\n');
        break;
      case 'PWD':
        socket.write(`257 "${currentDir}" is the current directory.\r\n`);
        break;
      case 'EPSV':
        passivePort = Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024;
        dataSocket = net.createServer((dataSocket) => {
          auditPort = dataSocket.on('connection', (client) => {
            //порт просто открывается
          });
        });

        dataSocket.listen(passivePort, () => {
          socket.write(`229 Entering Extended Passive Mode (|||${passivePort}|).\r\n`);
        });
        break;
      case 'TYPE':
        const sym = arg.toUpperCase();

        if (sym === 'A') {
          socket.write('200 Type set to A.\r\n');
        } else if (sym === 'I') {
          socket.write('200 Switch to "binary" transfer mode.\r\n');
        } else if (sym === 'L') { 
          socket.write('200 \r\n');
        } else {
          socket.write('504 Command not implemented for that parameter.\r\n');
        }

        break;
      case 'LIST':
        if (passivePort) {
          socket.write(`150 File status okay; about to open data connection.\r\n`);
          var str = "";
          const files = fs.readdirSync("/home/b/screen");

          files.forEach(file => {
            try {
              const stats = fs.statSync(path.join('/home/b/screen', file));

              const options = { 
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false 
              }; 
              const mode = stats.mode.toString(8).slice(-3);
              const size = stats.size.toString().padStart(10, ' ')
              const mtime = stats.mtime.toLocaleString('en-US', options).replace(',', '');

              str += `${mode} ${size} ${mtime} ${file}\r\n`;
            } catch {
              console.log("похуй")
            }
          });

          auditPort.write(str);
          auditPort.end('')

          socket.write('226 Closig data connection\r\n')
        } else {
          socket.write('425 Use EPSV first.\r\n');
        }
        break;
      case 'SIZE':
        socket.write('213 2041\r\n')
        break;
      case 'RETR':
        const filePath = path.join('./ftp_files', arg);
        //fs.stat(filePath, (err, stats) => {
        //  console.log(err)
        //  console.log(stats.isFile())
        //  if (err || !stats.isFile()) {
        //    socket.write('550 File not found.\r\n');
        //  } else {
        //    socket.write('150 Opening data connection.\r\n');
        //    const readStream = fs.createReadStream(filePath);
        //    readStream.pipe(socket);
        //    readStream.on('end', () => {
        //      socket.write('226 Transfer complete.\r\n');
        //    });
        //  }
        //});
        try {
          const stats = fs.statSync(filePath);
          if (stats.isFile()) {
            // Уведомляем о начале передачи данных
            socket.write(`150 File status okay; about to open data connection\r\n`);

            // Создаем новое соединение для передачи данных
            const dataSocket = net.createConnection(DATA_PORT, 'localhost', () => {
              const fileContent = fs.readFileSync(filePath);
              dataSocket.write(fileContent);
              dataSocket.end(); // Закрываем соединение после передачи
            });

            dataSocket.on('end', () => {
              socket.write(`226 Transfer complete.\r\n`);
            });

            dataSocket.on('error', (err) => {
              console.error('Data socket error:', err);
              socket.write('426 Connection closed; transfer aborted.\r\n');
            });
          } else {
            socket.write('550 File not found.\r\n');
          }
        } catch (err) {
          socket.write('550 File not found.\r\n');
        }
        break;
      case 'QUIT':
        socket.write('221 Goodbye.\r\n');
        break;
      case 'REG':
        socket.write('221 Goodbye.\r\n');
        break;
      default:
        socket.write('502 Command not implemented.\r\n');
        break;
    }
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

server.listen(3000, '192.168.0.11', () => {
  console.log('FTP server is running on port 3000');
});
