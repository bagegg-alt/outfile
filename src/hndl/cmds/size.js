const fs = require('fs');

module.exports = {
  cmd: 'SIZE',
  hndl: function() {
    filePath = path.join('./ftp_files', this.args[0])
    fs.stat(filePath, (err, stats) => {
      if (err) {
        this.socket.write('550 \r\n')
        return;
      }
      if (stats.isFile()) {
        this.socket.write(`213 ${stats.size}\r\n`)
      } else {
        this.socket.write('550 \r\n')
      }
    })
  }
}
