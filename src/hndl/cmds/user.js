module.exports = {
  cmd: 'USER',
  hndl: function() {
    this.user = this.args[0];

    if (!this.user) this.isAnonim = true;

    this.socket.write('331 User name okay, need password.\r\n');
  }
}
