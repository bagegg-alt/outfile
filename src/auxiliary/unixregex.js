const addUniqueEl = require('./addUniqueEl');

const startPoint_en_az = 97;
const startPoint_en_AZ = 65;

const startPoint_num = 48;

const startPoints = [startPoint_en_az, startPoint_en_AZ, startPoint_num];

function getElSet(el) {
  if(el >= 'a' && el <= 'z') {
    return 0;
  } else if(el >= 'A' && el <= 'Z') {
    return 1;
  } else if(el >= '0' && el <= '9') {
    return 2;
  }
  return undefined;
}

function creatingSet(startEl, endEl) {
  const alphStartEl = getElSet(startEl);
  const alphEndEl = getElSet(endEl);

  const startPoint = startEl.charCodeAt(0);
  const quantityEl = endEl.charCodeAt(0) - startPoint + 1;

  if(quantityEl > 0 && alphStartEl && alphStartEl == alphEndEl) {
    return Array.from(quantityEl), i => String.fromCharCode(i + startPoint); // (_, i)
  }
  return false;
}

function createArrOps(pattern) {
  const fillSet = (el) => {
    var enumFunc;

    if(el == ']') {
      enumFunc = () => {
        if(arr[k + 1] == '-') {
          var enumArr = creatingSet(arr[k], arr[k + 2]);

          if(!enumArr) enumArr = [arr[k], '-', arr[k + 2]];
          pushUniqueEl(arr, enumArr);

          k+=2;
          return true;
        }
      }
    } else {
      enumFunc = () => {
        if(arr[k + 1] == '.' && arr[k + 2] == '.') {
          var enumArr = creatingSet(arr[k], arr[k + 3]);

          if(!enumArr) enumArr = [arr[k], '.', arr[k + 3]];
          pushUniqueEl(arr, enumArr);

          k+=3;
          return true;
        }
      }
    }


    const arr = [];

    for(var j = i + 1; j < pattern.length; j++) {
      if(pattern[j] == el) {
        for(var k = i + 1; k < j; k++) {
          if(!enumFunc() && !arr.includes(pattern[k])) arr.push(pattern[k]);
        }
        i = j;
        if(arr.length == 0) throw new Error('некорректное выражение');
        return arr;
      }
    }
    return [el];
  }

  const operators = {
    '*': () => arrElPattern.push({
      action: (obj) => {
        obj.point++;
        obj.pointJmp = obj.step;

        obj.step--;
      },
      length: 0,
    }),
    '?': () => arrElPattern.push({
      action: (obj) => {
        obj.point++;
      },
      length: 1,
    }),
    '[': () => arrElPattern.push({
      action: (obj) => {
        if(obj.ops[obj.point].enum.includes(obj.file[obj.step])) {
          obj.point++;
        } else if(obj.pointJmp) {
          obj.point = obj.pointJmp;
        } else {
          obj.isBreak = true;
        }
      },
      length: 1,
      enum: fillSet(']'),
    }),
    '{': () => arrElPattern.push({
      action: (obj) => {
        if(obj.ops[obj.point].enum.includes(obj.file[obj.step])) {
          obj.point++;
        } else if(obj.pointJmp) {
          obj.point = obj.pointJmp;
        } else {
          obj.isBreak = true;
        }
      },
      length: 1,
      enum: fillSet('}'),
    }),
  }

  const createLit = (value) => ({
    action: (obj) => {
      if(obj.file.slice(obj.step, obj.step + obj.ops[obj.point].length) == obj.ops[obj.point].value) {
        obj.step += obj.ops[obj.point].length;
        obj.point++;
      } else if(obj.pointJmp !== false) {
        obj.point = obj.pointJmp;
      } else {
        obj.isBreak = true;
      }
    },
    class: 'literal',
    get length() {
      return this.value.length;
    },
    value: value,
  });

  const arrElPattern = [];

  var str = '';

  for(var i = 0; i < pattern.length; i++) {
    if(operators[pattern[i]]) {
      if(str.length != 0) arrElPattern.push(createLit(str));

      operators[pattern[i]]();
      str = '';
    } else {
      str += pattern[i];
    }
  }
  if(str.length != 0) arrElPattern.push(createLit(str));
  
  arrElPattern.push({ action: (obj) => { obj.approvedFiles.push(obj.file); obj.isBreak = true } });

  return arrElPattern;
}

module.exports = async (patterns, files) => {
  const arrsOps = [];
  try {
    for(var i = 0; i < patterns.length; i++) {
      arrsOps.push(createArrOps(patterns[i]));
    }
  } catch (error) {
    console.log(error);
  }

  var approvedFiles = [];

  for(var i = 0; i < arrsOps.length; i++){
    var ops = arrsOps[i];
    for(var j = 0; j < files.length; j++) {
      if(!approvedFiles.includes(files[j])) {
        const obj = {
          ops: ops,
          pointJmp: false, 
          point: 0, 
          isBreak: false, 
          file: files[j],
          step: 0,
          approvedFiles: approvedFiles,
        };

        for(var k = 0; k < obj.file.length + 2; k++) {
          if(obj.isBreak) break;

          obj.step = k;
          ops[obj.point].action(obj);
          k = obj.step;
        }
      }
    }
  }

  console.log(approvedFiles);

  return approvedFiles;
}
