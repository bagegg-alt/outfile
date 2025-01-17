const { init } = require('./db');
const hashing = require('../auxiliary/hashing');

const authentication = async (username, password) => {
  const users = init('Users');

  const user = await users.findOne({ name: username });

  return user ? await hashing(password, user.salt, 512, 64) === user.hash : false;
}

const exist = async (username) => {
  const users = init('Users');

  return await users.findOne({ name: username });
}


const insertDB = async (username, crypto) => {
  const users = init('Users');

  const { hash, salt } = await crypto.getHashSalt(64, 32, 512);
  const name = username;

  const { pubKey, prvKeyEnc, saltRsa } = await crypto.genRsa(hash);

  const files = [];

  await users.insertOne({ name, hash, salt, pubKey, prvKeyEnc, saltRsa, files });
}

const pushFileInfoDB = async (username, file, iv, salt) => {
  const users = init('Users');

  await users.updateOne(
    { name: username },
    { $addToSet: {
      files: { file, iv, salt }
    } }
  )
}

const pullFileInfoDB = async (username, files) => {
  const users = init('Users');

  await users.updateOne(
    { name: username },
    { $pull: {
      files: { file: { $in: files } }
    } }
  )
}

const getFileInfoDB = async (username, file) => {
  const users = init('Users');
  const user = await users.findOne({ name: username });

  const f = await user.files.find(f => f.file === file);

  const { iv, salt } = f;

  return await { iv, salt };
}

const getPubRsaDB = async (username) => {
  const users = init('Users');
  const user = await users.findOne({ name: username });

  return user.pubKey;
}

const getPrvRsaEncDB = async (username) => {
  const users = init('Users');
  const user = await users.findOne({ name: username });

  const prvKeyEnc = user.prvKeyEnc;
  const saltRsa = user.saltRsa;
  
  return { prvKeyEnc, saltRsa };
}

module.exports = {
  auth: authentication,
  isExist: exist,
  insert: insertDB,
  pushFileInfo: pushFileInfoDB,
  pullFileInfo: pullFileInfoDB,
  getFileInfo: getFileInfoDB,
  getPubRsa: getPubRsaDB,
  getPrvRsaEnc: getPrvRsaEncDB,
}
