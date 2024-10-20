const fs = require('fs');
const path = require('path');

module.exports = {
  cmd: 'RETR',
  hndl: function() {
    filePath = path.join(this.currentDir, this.args[0])
    const startPosition = this.startPosition || 0;

    this.socket.write('150 Opening binary mode data connection\r\n');


    const readStream = fs.createReadStream(filePath, { start: startPosition });

    readStream.on('data', (chunk) => {
      this.auditSocket.write(chunk);
    });

    readStream.on('end', () => {
      this.auditSocket.end();
      this.socket.write('226 успешно\r\n');
    });

    readStream.on('error', (err) => {
      this.socket.write('550 файл не найден\r\n');
    });
  }
}
