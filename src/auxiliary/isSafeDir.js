const path = require('path');

module.exports = function (filePath) {
  return (filePath.startsWith(this.currentDir + '/') || filePath === this.currentDir);
}
