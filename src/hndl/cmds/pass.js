const path = require('path');

module.exports = {
  cmd: 'PASS',
  hndl: function() {
    if (this.args[0] !== 'a'){
      this.socket.write('530 access denied\r\n');
    } else {
      this.currentDir = path.join('../ftp_files', this.user);

      this.socket.write('230 User logged in, proceed.\r\n');
    }
  }
}
