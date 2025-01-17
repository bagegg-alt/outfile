const path = require('path');

module.exports = (currentDir, args) => {
  return new Promise((resolve, reject) => {
    const dirsAndFiles = {};

    for(var i = 0; i < args.length; i++) {
      const filePath = path.join(currentDir, args[i]);

      const partsPath = filePath.split('/');
      const filteredPartsPath = partsPath.filter(part => part !== '');

      const dir = filteredPartsPath.slice(0, -1);
      const dirPath = path.join(...dir);

      const file = filteredPartsPath[filteredPartsPath.length - 1];

      if(dirsAndFiles[dirPath]) {
        dirsAndFiles[dirPath].push(file);
      } else {
        dirsAndFiles[dirPath] = [file];
      }
    }
    resolve(dirsAndFiles);
  })
}
