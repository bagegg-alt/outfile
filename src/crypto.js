const hashPass = require('./auxiliary/hashing');
const saltPass = require('./auxiliary/genSalt');

module.exports = class {
  #password;

  constructor(password){
    this.#password = password;
  }

  getHS(){
    const salt = saltPass();
    const hash = hashPass(this.#password, salt);

    return { hash, salt }
  }
}
