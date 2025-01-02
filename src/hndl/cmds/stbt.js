const { createReadStream, createWriteStream, rename } = require('fs');
const { createCipheriv, randomBytes, publicEncrypt } = require('crypto');
const { constants } = require('crypto');

const path = require('path');

const { ObjectId } = require('mongodb');

const hasing = require('../../auxiliary/hashing.js');

module.exports = {
  cmd: 'STBT', // 0 - файл, 1 - пользователь, ~2~ - место
  hndl: async function() {
    if(this.args[2] === null) {
      this.args[2] = 0;
    }

    // инициализация дешифрования
    const { iv, salt } = await this.mongoUsers.getFileInfo(this.user, this.args[0]);

    const decipher = await this.crypto.getDecipher(iv, salt);

    // инициализация чтения файла 
    const objRS = {
      highWaterMark: 64 * 1024 
    }

    const filePathRead = path.join(this.currentDir, this.args[0])

    const readStream = createReadStream(filePathRead, objRS);

    // инициализация шифрования с рандомным ключом
    const iv2c = randomBytes(16);
    //const ivBuffer = Buffer.from(iv2c, 'hex');

    const key = randomBytes(16);

    const cipher = createCipheriv('aes-256-cbc', key.toString('hex'), iv2c);
    
    // шифрование ключа
    const pubKey = await this.mongoUsers.getPubRsa(this.args[1]);

    const encAesKey = publicEncrypt(
      {
        key: pubKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      key
    );

    // создание object id
    const objId = ObjectId().toString().slice(10, 34);

    // запись
    const filePathWrite = path.join('..', 'ftp_files', 'BufferTxns', objId);

    const writeStream = createWriteStream(filePathWrite);

    readStream.pipe(decipher).pipe(cipher).pipe(writeStream);

    writeStream.on('finish', () => {
      this.socket.write('226 успешно\r\n');

      this.mongoTxns.insert(this.user, this.args[1], this.args[0], objId, this.args[2], encAesKey, iv2c.toString('hex'));
    });

    writeStream.on('error', (err) => {
      this.socket.write('550 \r\n');
    });


    cipher.on('data', (chunk) => {
      writeStream.write(chunk);
    });

    cipher.on('end', () => {
      writeStream.end();
    });
  }
}
