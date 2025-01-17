const addUniqueEl = require('./addUniqueEl');
const unixregex = require('./unixregex');

module.exports = async (patterns, files) => {
  console.log(files);
  console.log(patterns);

  return await unixregex(patterns, files);
}
