const fs = require('fs');
const path = require('path');
const net = require('net');

const isPathSafe = require('../../auxiliary/isSafeDir');

const options = { 
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false 
}; 

function modeToString(mode){
  return [
    (mode & 0o40000) ? 'd' : '-',
    (mode & 0o400) ? 'r' : '-',
    (mode & 0o200) ? 'w' : '-',
    (mode & 0o100) ? 'x' : '-',
    (mode & 0o040) ? 'r' : '-',
    (mode & 0o020) ? 'w' : '-',
    (mode & 0o010) ? 'x' : '-',
    (mode & 0o004) ? 'r' : '-',
    (mode & 0o002) ? 'w' : '-',
    (mode & 0o001) ? 'x' : '-'
  ].join('');
}

module.exports = {
  cmd: 'LIST',
  hndl: function() {
    filesPath = path.join(this.currentDir, this.args[0] || '');

    if (!isPathSafe.call(this, filesPath)){
      this.socket.write('530 \r\n');
    }
    fs.readdir(this.currentDir, (err, files) => {
      if (err) {
        this.socket.write('550 Requested action not taken. Directory not found\r\n');
        return;
      }

      this.socket.write(`150 Here comes the directory listing\r\n`);

      var listPromise = files.map(file => {
        return new Promise((resolve, reject) => {
          const filePath = path.join(this.currentDir, file);
          fs.stat(filePath, (err, stats) => {
            if (err) {
              reject(`${file} - Error retrieving file info`);
            } else {
              const size = stats.size.toString().padStart(10, ' ');
              const mode = modeToString(stats.mode);
              const mtime = stats.mtime.toLocaleString('en-US', options).replace(',', '');

              resolve(`${mode}  ${size}  ${mtime}  ${file}`);
            }
          });
        });
      });

      Promise.all(listPromise).then(list => {
        this.auditSocket.write(`${list.reduce((acc, cur) => {
          return acc + cur + '\r\n';
        }, '')}`);
        this.auditSocket.end('');
        this.socket.write('226 Directory send OK\r\n');
      });
    });
  }
}

