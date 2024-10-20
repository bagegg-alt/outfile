const fs = require('fs');
const path = require('path');

module.exports = {
  cmd: 'STOR',
  hndl: function() {
    filePath = path.join(this.currentDir, this.args[0])
    fileData = ''

    this.socket.write('150 Opening binary mode data connection\r\n');

    this.auditSocket.on('data', (chunk) => {
      fileData += chunk.toString('utf-8')
    })

    this.auditSocket.on('end', () => {
      fs.writeFile(filePath, fileData, (err) => {
        if (err) {
          this.auditSocket.write('550 \r\n')
          return;
        }
        this.auditSocket.end()
        this.socket.write('226 \r\n')
      }) 
    })
  }
}
