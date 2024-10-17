module.exports = {
  cmd: 'PWD',
  hndl: function() {
    this.socket.write(`257 "${this.currentDir}" is the current directory.\r\n`);
  }
}
