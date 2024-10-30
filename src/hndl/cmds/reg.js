module.exports = {
  cmd: 'REG',
  hndl: function() {
    this.socket.write('200 \r\n')
  }
}
