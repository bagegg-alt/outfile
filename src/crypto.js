const crypto = require('crypto');

const hashing = require('./auxiliary/hashing');

const ivFixed = 'ffffffffffffffffffffffffffffffff'; // временная мера

module.exports = class {
  #password;

  constructor(password){
    this.#password = password;
  }

  gen(length = 16){
    return crypto.randomBytes(length).toString('hex');
  }

  async genRsa(){
    const { pubKey, prvKey } = await new Promise((resolve, reject) => {
      crypto.generateKeyPair('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      }, (err, pubKey, prvKey) => {
        if (err) {
          return reject(err);
        }
        resolve({ pubKey, prvKey });
      });
    });

    const ivBuffer = Buffer.from(ivFixed, 'hex');

    const saltRsa = this.gen(32);
    const hash = await hashing(this.#password, saltRsa, 256, 16);
    const cipher = await crypto.createCipheriv('aes-256-cbc', hash, ivBuffer);

    var prvKeyEnc = cipher.update(prvKey, 'utf-8', 'hex');
    prvKeyEnc += cipher.final('hex');

    return { pubKey, prvKeyEnc, saltRsa };
  }

  async getHashSalt(hashLen = 32, saltLen = 16, dig = 256){
    const salt = this.gen(saltLen);
    const hash = await hashing(this.#password, salt, dig, hashLen);
    return { hash, salt };
  }

  async getHash(salt){
    const hash = await hashing(this.#password, salt, 256, 16);
    return { hash };
  }

  async getCipher(){
    const ivBuffer = Buffer.from(this.gen(), 'hex');
    const { hash, salt } = await this.getHashSalt(16, 32); 

    const cipher = await crypto.createCipheriv('aes-256-cbc', hash, ivBuffer);

    const iv = ivBuffer.toString('hex');
    return { cipher, salt, iv }
  }

  async getDecipher(iv, salt){
    const ivBuffer = Buffer.from(iv, 'hex');

    const hash = await hashing(this.#password, salt, 256, 16);

    return await crypto.createDecipheriv('aes-256-cbc', hash, ivBuffer);
  }

  async getDecipherTest(key, iv){
    return await crypto.createDecipheriv('aes-256-cbc', key, iv);
  }

  async getPrvKey(prvKeyEnc, saltRsa){
    const decipher = await this.getDecipher(ivFixed, saltRsa);

    var prvKey = decipher.update(prvKeyEnc, 'hex', 'utf-8');
    prvKey += decipher.final('utf-8');

    return prvKey;
  }
}
