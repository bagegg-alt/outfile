const { createReadStream, createWriteStream, rename } = require('fs');
const { createDecipheriv, randomBytes, privateDecrypt } = require('crypto');
const { constants } = require('crypto');

const path = require('path');

const { ObjectId } = require('mongodb');

const hasing = require('../../auxiliary/hashing.js');

module.exports = {
  cmd: 'GFBT', // 0 - файл, 1 - отправитель, ~2~ - место
  hndl: async function() {
    // дешифрование приватного ключа
    const { prvKeyEnc, saltRsa } = await this.mongoUsers.getPrvRsaEnc(this.user);
    const prvKey = await this.crypto.getPrvKey(prvKeyEnc, saltRsa);

    // получение информации о файле
    const { fileId, encKey, iv2c } = await this.mongoTxns.extract(this.args[1], this.user, this.args[0]);
    console.log(`${this.args[1]} ${this.user} ${this.args[0]}`)

    // инициализация чтения файла
    const objRS = {
      highWaterMark: 64 * 1024 
    }

    const filePathRead = path.join('..', 'ftp_files', 'BufferTxns', fileId);

    const readStream = createReadStream(filePathRead, objRS);

    // дешифрование ключа дешифрования с помощью приватного ключа
    const aesKey = privateDecrypt(
      {
        key: prvKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(encKey.buffer)
    );
    console.log(aesKey);
    console.log(aesKey.toString('hex'));

    // инициализация дешифрования
    const decipher = createDecipheriv('aes-256-cbc', aesKey.toString('hex'), Buffer.from(iv2c, 'hex'));

    // инициализация шифрования 
    const cipherSI = await this.crypto.getCipher();
    const { cipher } = cipherSI;

    const { salt, iv } = cipherSI;

    // запись
    const filePathWrite = path.join(this.currentDir, this.args[0]);

    const writeStream = createWriteStream(filePathWrite);

    readStream.pipe(decipher).pipe(cipher).pipe(writeStream).on('error', (err) => { console.log(err) });


    writeStream.on('finish', () => {
      this.socket.write('226 успешно\r\n');

      this.mongoUsers.pushFileInfo(this.user, this.args[0], iv, salt);
    });

    writeStream.on('error', (err) => {
      this.socket.write('550 файл не найден\r\n');
    });

    decipher.on('error', (err) => {
      // Игнорируем ошибку
      if (err.code === 'ERR_OSSL_BAD_DECRYPT') {
        console.log('Ignoring ERR_OSSL_BAD_DECRYPT error.');
        writeStream.end();
      } else {
        console.error('Decipher error:', err);
      }
    });

    cipher.on('data', (chunk) => {
      writeStream.write(chunk);
    });

    cipher.on('end', () => {
      writeStream.end();
    });
  }
}
