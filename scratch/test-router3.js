function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function pathToRegex(path, exact = false) {
  if (path === '*') return { regex: /(.*)/, keys: [] };
  
  const keys = [];
  let regexStr = escapeRegExp(path); // '/gestoria/\\*'
  
  // Restaurem sintaxi d'expressió
  regexStr = regexStr.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    keys.push(key);
    return '([^\\/]+)';
  });
  
  // FIXED: endsWith('/\\*') instead of '\\/\\*'
  if (regexStr.endsWith('/\\*')) {
      regexStr = regexStr.replace(/\/\*$/, '(?:\\/(.*))?');
      keys.push('*');
  } else {
      regexStr = regexStr.replace(/\\\*/g, '(.*)');
  }

  // Exact matching vs Prefix matching
  const finalRegexStr = exact ? '^' + regexStr + '$' : '^' + regexStr + '(?=\\/|$)';
  console.log("finalRegexStr:", finalRegexStr)
  return { regex: new RegExp(finalRegexStr), keys };
}

const match = '/gestoria'.match(pathToRegex('/gestoria/*', false).regex);
console.log("Match:", match);
