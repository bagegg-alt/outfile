const fs = require('fs');
const path = require('path');

module.exports = {
  cmd: 'RNFR',
  hndl: function() {
    if(!this.rename) {
      this.socket.write('503 \r\n');
      return;
    }    
    filePath = path.join(this.currentDir, this.args[0])
    fs.rename(this.rename, filePath, (err) => {
      if (err) {
        this.socket.write('550 \r\n');
      } else {
        this.socket.write('250 \r\n');
      }
    })
  }
}

