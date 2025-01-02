const fs = require('fs');
const path = require('path');

const zlib = require('zlib');

function handleTransferCompletion(readStream) {
  readStream.on('end', () => {
    this.auditSocket.end();
    this.socket.write('226 успешно\r\n');
  });

  readStream.on('error', (err) => {
    this.socket.write('550 файл не найден\r\n');
  });
}


function stream(readStream) {
  this.socket.write('150 binary\r\n');
  
  readStream.on('data', (chunk) => {
    this.auditSocket.write(chunk);
  });

  handleTransferCompletion.call(this, readStream);
}

function compressed(readStream) {
  this.socket.write('150 compressed\r\n');

  readStream.on('data', (chunk) => {
    this.auditSocket.write(chunk);
  });

  handleTransferCompletion.call(this, readStream);
}

function block(readStream) {
  this.socket.write('150 block\r\n');

  readStream.on('data', (chunk) => {
    //this.auditSocket.write(`${chunk.length}\r\n`);
    this.auditSocket.write(chunk);
  });

  handleTransferCompletion.call(this, readStream);
}


module.exports = {
  cmd: 'RETR',
  hndl: async function() {
    const filePath = path.join(this.currentDir, this.args[0]);

    const startPos = this.startPosition || 0;
    const blockSize = 1024 * 1024; //1мб

    const { iv, salt } = await this.mongoUsers.getFileInfo(this.user, this.args[0]);
    
    const decipher = await this.crypto.getDecipher(iv, salt);
    switch(this.mode){
      case 'B':
        objRS = {
          start: startPos,
          highWaterMark: blockSize        
        }
        readStream = fs.createReadStream(filePath, objRS);

        readStream.pipe(decipher);

        block.call(this, decipher);
        break;
      case 'C':
        objRS = {
          start: startPos
        }
        readStream = fs.createReadStream(filePath, objRS);

        const gzip = zlib.createGzip();
        readStream.pipe(decipher).pipe(gzip);

        compressed.call(this, gzip);
        break;
      default:
        objRS = {
          start: startPos,
          highWaterMark: 64 * 1024 
        }
        readStream = fs.createReadStream(filePath, objRS);

        readStream.pipe(decipher);

        stream.call(this, decipher);
    }
  }
}
