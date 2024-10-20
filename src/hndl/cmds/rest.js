module.exports = {
  cmd: 'REST',
  hndl: function() {
    this.startPosition = Number(this.args[0]);  
    this.socket.write('350 \r\n')
  }
}
