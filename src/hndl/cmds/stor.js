const fs = require('fs');
const path = require('path');

const zlib = require('zlib');

var salt, iv;

function handlerWriteStream(writeStream, stream){
  this.socket.write(`150 ${this.mode}\r\n`);


  writeStream.on('finish', () => {
    this.auditSocket.end();
    this.socket.write('226 успешно\r\n');

    this.mongo.pushFileInfo(this.user, this.args[0], iv, salt);
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
  hndl: async function() {
    const filePath = path.join(this.currentDir, this.args[0])

    const cipherSI = await this.crypto.getCipher();
    const { cipher } = cipherSI;
    
    ( { salt, iv } = cipherSI );

    const writeStream = fs.createWriteStream(filePath);
    switch(this.mode){
      case 'C':
        const gunzip = zlib.createGunzip();

        this.auditSocket.pipe(cipher).pipe(gunzip);

        handlerWriteStream.call(this, writeStream, gunzip);
        break;
      default:
        this.auditSocket.pipe(cipher);
        handlerWriteStream.call(this, writeStream, cipher);
        break;
    }
  }
}
