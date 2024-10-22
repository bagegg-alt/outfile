const fs = require('fs');
const path = require('path');

module.exports = {
  cmd: 'STOR',
  hndl: function() {
    filePath = path.join(this.currentDir, this.args[0])
    const writeStream = fs.createWriteStream(filePath);

    this.socket.write('150 Opening binary mode data connection\r\n');
    

    this.auditSocket.on('data', (chunk) => {
      writeStream.write(chunk);
    });

    writeStream.on('finish', () => {
      this.auditSocket.end();
      this.socket.write('226 Transfer complete.\r\n');
    });

    writeStream.on('error', (err) => {
      this.auditSocket.write('550 Requested action not taken. File unavailable.\r\n');
    });

    this.auditSocket.on('end', () => {
      writeStream.end();
    });
  }
}
