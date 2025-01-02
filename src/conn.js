module.exports = class {
  // режимы
  mode;
  stru;

  // сокеты
  auditSocket;
  socket; 
  sock; 

  // команды и аргументы
  cmd;
  args;

  // переменные для связи между командами
  user;
  anonim;
  rename;
  currentDir; 
  startPosition;

  //шифрование/дешифрование файлов
  crypto;

  //бд
  mongo;
  mongoUsers;
  mongoTxns;
}
