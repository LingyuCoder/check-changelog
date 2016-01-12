'use strict';
const fs = require('fs');
const path = require('path');

module.exports = dir => {
  let pkg;
  try {
    pkg = fs.readFileSync(path.join(dir, 'package.json'), 'utf-8');
  } catch (e) {
    if (e.message.indexOf('ENOENT') !== -1)
      throw new Error(`Can not find package.json in ${dir}`);
    throw e;
  }
  try {
    pkg = JSON.parse(pkg);
  } catch (e) {
    throw new Error(`Can not parse package.json in ${dir}`);
  }
  return pkg;
};
