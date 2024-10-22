module.exports = {
  cmd: 'MODE',
  hndl: function() {
    this.mode = this.args[0];
    this.socket.write('200 \r\n');
  }
}
