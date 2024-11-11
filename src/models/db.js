const { MongoClient } = require('mongodb');

const hashing = require('../auxiliary/hashing');

const url = 'mongodb://127.0.0.1:27017/';
const dbName = 'outfile';

const client = new MongoClient(url);

const startDB = async () => {
  try{
    await client.connect();
  } catch (err) {
    console.log(err);
  }
}


const initDB = () => {
  const db = client.db(dbName);
  return db.collection('Users');
}

const authentication = async (username, password) => {
  const users = initDB();

  const user = await users.findOne({ name: username });

  return user ? await hashing(password, user.salt, 512, 64) === user.hash : false;
}

const exist = async (username) => {
  const users = initDB();

  return await users.findOne({ name: username });
}


const insertDB = async (username, crypto) => {
  const users = initDB();

  const { hash, salt } = await crypto.getHashSalt(64, 32, 512);
  const name = username;

  const files = [];

  await users.insertOne({ name, hash, salt, files });
}

const pushFileInfoDB = async (username, file, iv, salt) => {
  const users = initDB();

  await users.updateOne(
    { name: username },
    { $addToSet: {
      files: { file, iv, salt }
    } }
  )
}

const getFileInfoDB = async (username, file) => {
  const users = initDB();
  const user = await users.findOne({ name: username });

  const f = await user.files.find(f => f.file === file);

  const { iv, salt } = f;

  return await { iv, salt };
}

module.exports = {
  start: startDB,
  auth: authentication,
  isExist: exist,
  insert: insertDB,
  pushFileInfo: pushFileInfoDB,
  getFileInfo: getFileInfoDB,
}
