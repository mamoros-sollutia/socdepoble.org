function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function pathToRegex(path, exact = false) {
  if (path === '*') return { regex: /(.*)/, keys: [] };
  const keys = [];
  let regexStr = escapeRegExp(path);
  regexStr = regexStr.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    keys.push(key);
    return '([^\\/]+)';
  });
  if (regexStr.endsWith('\\/\\*')) {
      regexStr = regexStr.replace(/\\\/\*$/, '(?:\\/(.*))?');
      keys.push('*');
  } else {
      regexStr = regexStr.replace(/\\\*/g, '(.*)');
  }
  const finalRegexStr = exact ? '^' + regexStr + '$' : '^' + regexStr + '(?=\\/|$)';
  return { regex: new RegExp(finalRegexStr), keys };
}

console.log('AppRoutes match:', '/gestoria'.match(pathToRegex('/gestoria/*', false).regex));
