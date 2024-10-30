const fs = require('fs');
const path = require('path');

const zlib = require('zlib');

function handlerWriteStream(writeStream, stream){
  this.socket.write(`150 ${this.mode}\r\n`);


  writeStream.on('finish', () => {
    this.auditSocket.end();
    this.socket.write('226 успешно\r\n');
  });

  writeStream.on('error', (err) => {
    this.socket.write('550 файл не найден\r\n');
  });


  stream.on('data', (chunk) => {
    writeStream.write(chunk);
  });

  stream.on('end', () => {
    writeStream.end();
  });
}

module.exports = {
  cmd: 'STOR',
  hndl: function() {
    const filePath = path.join(this.currentDir, this.args[0])

    const gunzip = zlib.createGunzip();

    const writeStream = fs.createWriteStream(filePath);
    switch(this.mode){
      case 'C':
        this.auditSocket.pipe(gunzip);

        handlerWriteStream.call(this, writeStream, gunzip);
        break;
      default:
        handlerWriteStream.call(this, writeStream, this.auditSocket);
        break;
    }
  }
}
