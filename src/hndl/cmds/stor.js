const fs = require('fs');
const path = require('path');

const zlib = require('zlib');

function handleTransferCompletion(writeStream) {
  writeStream.on('finish', () => {
    this.auditSocket.end();
    this.socket.write('226 успешно\r\n');
  });

  writeStream.on('error', (err) => {
    this.socket.write('550 файл не найден\r\n');
  });
}



module.exports = {
  cmd: 'STOR',
  hndl: function() {
    const filePath = path.join(this.currentDir, this.args[0])

    const startPos = this.startPosition || 0;
    const blockSize = 1024 * 1024; //1мб

    const writeStream = fs.createWriteStream(filePath);

    this.socket.write('150 Opening binary mode data connection\r\n');
    

    this.auditSocket.on('data', (chunk) => {
      writeStream.write(chunk);
    });

    this.auditSocket.on('end', () => {
      writeStream.end();
    });
  }
}
