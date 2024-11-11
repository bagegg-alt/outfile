const crypto = require('crypto');

const hashing = require('./auxiliary/hashing');


module.exports = class {
  #password;

  constructor(password){
    this.#password = password;
  }

  gen(length = 16){
    return crypto.randomBytes(length).toString('hex');
  }

  async getHashSalt(hashLen = 32, saltLen = 16, dig = 256){
    const salt = this.gen(saltLen);
    const hash = await hashing(this.#password, salt, dig, hashLen);
    return { hash, salt };
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
}
