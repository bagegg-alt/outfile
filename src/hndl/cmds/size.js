const fs = require('fs').promises;
const path = require('path');

function getSize(filesPath) {
  return fs.stat(filesPath)
    .then(stats => {
      if(stats.isDirectory()){
        return fs.readdir(filesPath)
          .then(files => {
            var listPromise = files.map(file => {
              const filePath = path.join(filesPath, file);
              return getSize(filePath);
            })
            return Promise.all(listPromise);
          })
          .then(sizes => {
            return sizes.reduce((acc, cur) => {
              return acc + cur;
            }, 0);
          });
      } else {
        return stats.size;
      }
    });
}

module.exports = {
  cmd: 'SIZE',
  hndl: function() {
    filesPath = path.join(this.currentDir, this.args[0]);

    getSize(filesPath)
      .then(sizes => {
        this.socket.write(`213 ${sizes}\r\n`);
      })
      .catch(err => {
        this.socket.write('550 \r\n')
      })
  }
}
