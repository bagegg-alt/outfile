const path = require('path');

module.exports = {
  cmd: 'PASS',
  hndl: function() {
    if (this.isAnonim) {
      if (args[0]) this.crypto = new (require('../../crypto'))(this.args[0]);

      this.currentDir = path.join('../ftp_files', 'general');

      this.socket.write('230 User logged in, proceed.\r\n');
    } else {
      this.mongo.auth(this.user, this.args[0])
        .then(isAuth => {
          if (isAuth) {
            this.crypto = new (require('../../crypto'))(this.args[0]);

            this.currentDir = path.join('../ftp_files', this.user);

            this.socket.write('230 User logged in, proceed.\r\n');
          } else {
            this.socket.write('530 access denied\r\n');
          }
        }).catch(err => {
          console.log(err);
          this.socket.write('500 \r\n');
        })
    }
  }
}
