const fs = require('fs');
const path = require('path');

const isPathSafe = require('../../auxiliary/isSafeDir');

module.exports = {
  cmd: 'CWD',
  hndl: function() {
    filePath = path.join(this.currentDir, this.args[0])
    if(isPathSafe.call(this, filePath)) {
      this.currentDir = path.join (this.currentDir, this.args[0]);
      this.socket.write('250 \r\n')
    } else {
      this.socket.write('550 \r\n')
    }
  }
}
