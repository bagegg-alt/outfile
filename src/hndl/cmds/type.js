const fs = require('fs');

module.exports  = {
  cmd: 'TYPE',
  hndl: function() {
    const sym = this.args[0];

    if (sym === 'A') {
      this.socket.write('200 Type set to A.\r\n');
    } else if (sym === 'I') {
      this.socket.write('200 Switch to "binary" transfer mode.\r\n');
    } else if (sym === 'L') { 
      this.socket.write('200 \r\n');
    } else {
      this.socket.write('504 Command not implemented for that parameter.\r\n');
    }
  }
}
