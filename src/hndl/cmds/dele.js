const fs = require('fs');
const path = require('path');

const isPathSafe = require('../../auxiliary/isSafeDir');
const divisionPath = require('../../auxiliary/divisionPath');
const filterFilesByPattern = require('../../auxiliary/filterFilesByPattern');

module.exports = {
  cmd: 'DELE',
  hndl: async function() {
    const dirsAndFiles = await divisionPath(this.currentDir, this.args);

    for(const dir in dirsAndFiles) {
      if(isPathSafe.call(this, dir)) {
        fs.readdir(dir, async (err, files) => {
          const filteredFiles = await filterFilesByPattern(dirsAndFiles[dir], files);

          const filesOnDel = [];

          for(var i = 0; i < filteredFiles.length; i++) {
            const filePath = path.join(dir, filteredFiles[i]);

            fs.rm(filePath, { force: true }, (err) => {
              if(err){
                this.socket.write('550 обратитесь к создателю\r\n');
              } else {
                filesOnDel.push(filteredFiles[i]);
              }
            });
          }
          this.mongoUsers.pullFileInfo(this.user, filesOnDel);
        })
      } else {
        this.socket.write('530 у вас нет доступа к этой директории\r\n')
      }
    }
    this.socket.write('250 успешно\r\n');
  }
}
