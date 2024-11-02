const { MongoClient } = require('mongodb');

const hashPass = require('../auxiliary/hashing');

const url = 'mongodb://127.0.0.1:27017/';
const dbName = 'outfile';

const client = new MongoClient(url);


const db = client.db(dbName);
const users = db.collection('Users');


const authentication = async (username, password) => {
  const user = await users.findOne({ name: username });

  return user ? await hashPass(password, user.salt) === user.hash : false;
}

const exist = async (username) => {
  return await users.findOne({ name: username });
}

const startDB = async () => {
  try{
    await client.connect();
  } catch (err) {
    console.log(err);
  }
}

const insertDB = async (username, crypto) => {
  const { hash, salt } = crypto.getHS();
  const name = username;

  await usersCollection.insertOne({ name, hash, salt });
}


module.exports = {
  start: startDB,
  auth: authentication,
  isExist: exist,
  insert: insertDB
}
