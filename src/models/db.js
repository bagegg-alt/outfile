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

const initDB = (collection) => {
  const db = client.db(dbName);
  return db.collection(collection);
}

module.exports = {
  start: startDB,
  init: initDB,
}
