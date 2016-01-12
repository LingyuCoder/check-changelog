'use strict';

const co = require('co');
const changelogy = require('changelog2obj');
const _ = require('lodash');
const semver = require('semver');
const fs = require('fs');
const path = require('path');
const isFileExists = require('./lib/isFileExists');
const loadPkg = require('./lib/loadPkg');

module.exports = co.wrap(function*(cwd) {
  cwd = cwd || process.cwd();
  if (typeof cwd !== 'string') return Promise.reject(new TypeError('Expected cwd to be a string'));
  let version = loadPkg(cwd).version;
  let changelogPath = _.find(['changelog.md', 'CHANGELOG.md', 'history.md', 'HISTORY.md'], name => isFileExists(path.join(cwd, name)));
  if (!changelogPath) return {
    success: false
  };
  let satisfied = changelogy(fs.readFileSync(path.join(cwd, changelogPath), 'utf-8')).filter(content => semver.satisfies(content.version, version));
  return {
    success: satisfied.length > 0
  };
});
