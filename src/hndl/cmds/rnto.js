const fs = require('fs');
const path = require('path');

module.exports = {
  cmd: 'RNTO',
  hndl: function() {
    filePath = path.join(this.currentDir, this.args[0])
    fs.access(filePath, (err) => {
      if (err) {
        this.socket.write('550 \r\n');
      } else {
        this.rename = filePath;
        this.socket.write('350 \r\n');
      }
    })
  }
}
