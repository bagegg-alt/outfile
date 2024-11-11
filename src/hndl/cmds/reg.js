module.exports = {
  cmd: 'REG',
  hndl: async function() {
    if (this.isAnonim) {
      try {
        if (!await this.mongo.isExist(this.args[0])) {
          this.mongo.insert(this.args[0], this.crypto);
        } else {
          this.socket.write('500 ex \r\n');
        }
      } catch {
        this.socket.write('500 \r\n');
      }
    }
    this.socket.write('200 \r\n')
  }
}
