module.exports = {
  cmd: 'USER',
  hndl: function() {
    this.user = this.args[0];
    this.socket.write('331 User name okay, need password.\r\n');
  }
}
