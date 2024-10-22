module.exports = {
  cmd: 'PROT',
  hndl: function() {
    this.socket.write('200 User name okay, need password.\r\n');
  }
}
