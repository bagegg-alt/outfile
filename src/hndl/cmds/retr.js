const fs = require('fs');

module.exports = {
  cmd: 'RETR',
  hndl: function() {
    filePath = path.join('./ftp_files', this.args[0])
    this.socket.write('150 Opening binary mode data connection\r\n');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        this.socket.write('550 Файл не найден\r\n');
        return;
      }
      this.auditSocket.write(data.toString('utf-8') + '\r\n');
      this.auditSocket.end('');
      this.socket.write('226 Успешно\r\n');
    });
  }
}
