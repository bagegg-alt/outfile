function addUniqueEl(arr, el) {
  if(Array.isArray(arguments[1])) {
    for(var i = 0; i < el.length; i++) {
      if(!arr.includes(el[i])){
        arr.push(el[i]);
      }
    }
  } else {
    if(!arr.includes(el)){
      arr.push(el);
    }
  }
}

module.exports = addUniqueEl;
