const fs = require('fs');
const path = require('path');

const dir = '/home/b/pr/nodejs/outfile/src/hndl/cmds';
const cmds = [];

fs.readdirSync(dir).forEach(file => {
  cmds.push(require(path.join(dir, file)));
})

module.exports = cmds.reduce((acc, cur) => {
  acc[cur.cmd] = cur.hndl;
  return acc;
}, {})
