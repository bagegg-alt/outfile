module.exports = {
  cmd: 'REG',
  hndl: function() {
    if (this.isAnonim) {
      try {
        if (!this.mongo.isExist(this.args[0])) {
          this.mongo.insert(this.user, this.crypto);
        } else {
          this.socket.write('500 \r\n');
        }
      } catch {
        this.socket.write('500 \r\n');
      }
    }
    this.socket.write('200 \r\n')
  }
}
