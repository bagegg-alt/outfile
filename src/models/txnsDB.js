const { init } = require('./db');

const insertDB = async (sender, recipient, file, fileId, dir, encKey, iv2c) => {
  const txns = init('Txns');

  await txns.insertOne({ sender, recipient, file, fileId, dir, encKey, iv2c });
}

const extractDB = async (sender, recipient, file) => {
  const txns = init('Txns');

  const f = await txns.findOne({ sender, recipient, file });
  const { fileId, encKey, iv2c } = f;

  return await { fileId, encKey, iv2c };
}

module.exports = {
  insert: insertDB,
  extract: extractDB,
}
