const fs = require('fs');
const path = require('path');

const dir = './hndl/cmds/';
const relativeDir = './cmds';

const cmds = [];

fs.readdirSync(dir).forEach(file => {
  if (path.extname(file) === '.js') {
    cmds.push(require('./' + path.join(relativeDir, file)));
  }
})

module.exports = cmds.reduce((acc, cur) => {
  acc[cur.cmd] = cur.hndl;
  return acc;
}, {})
