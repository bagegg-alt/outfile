const fs = require('fs');
const path = require('path');

const isPathSafe = require('../../auxiliary/isSafeDir');

module.exports = {
  cmd: 'MKD',
  hndl: function() {
    dirPath = path.join(this.currentDir, this.args[0]);
    fs.mkdir(dirPath, { force: true }, (err) => {
      if(err){
        this.socket.write('550 обратись к создателю\r\n');
      } else {
        this.socket.write('250 файл удален\r\n');
      }
    }) 
  }
}
