const fs = require('fs');
const path = require('path');

const isPathSafe = require('../../auxiliary/isSafeDir');

module.exports = {
  cmd: 'DELE',
  hndl: function() {
    filePath = path.join(this.currentDir, this.args[0])
    if(isPathSafe.call(this, filePath)) {
      fs.rm(filePath, { force: true }, (err) => {
        if(err){
          this.socket.write('550 обратись к создателю\r\n');
        } else {
          this.socket.write('250 файл удален\r\n');
        }
      }) 
    } else {
      this.socket.write('530 \r\n')
    }
  }
}
