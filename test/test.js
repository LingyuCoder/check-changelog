'use strict';

require('should');
const checker = require('../index');
const path = require('path');
const mock = require('mock-fs');

describe('check-changelog', () => {
  describe('success', () => {
    it('should resolve an object with success true if found changelog of current version', () => {
      return checker(path.join(__dirname, 'success')).catch(e => console.error(e.message)).should.be.fulfilledWith({
        success: true
      });
    });
    it('should use current work directory as default', () => {
      return checker().catch(e => console.error(e.message)).should.be.fulfilledWith({
        success: true
      });
    });
  });
  describe('fail', () => {
    it('should resolve an object with success false if could not find changelog of current version', () => {
      return checker(path.join(__dirname, 'fail')).should.be.fulfilledWith({
        success: false
      });
    });
    it('should resolve an object with success false if no changelog file', () => {
      return checker(path.join(__dirname, 'no_changelog')).should.be.fulfilledWith({
        success: false
      });
    });
  });
  describe('access error', () => {
    before(() => mock({
      'test/error/no_access_package/package.json': mock.file({
        content: '{}',
        mode: '0750'
      })
    }));
    after(() => mock.restore());
    it('should reject an error if no access to package.json', () => {
      const dir = path.join(__dirname, 'error', 'no_access_package');
      return checker(dir).should.be.rejectedWith(Error, {
        message: `EACCES, permission denied '${path.join(dir, 'package.json')}'`
      });
    });
  });
  describe('error', () => {
    it('should reject an error if no package.json', () => {
      const dir = path.join(__dirname, 'error', 'no_package');
      return checker(dir).should.be.rejectedWith(Error, {
        message: `Can not find package.json in ${dir}`
      });
    });
    it('should reject an error if could not parse package.json', () => {
      const dir = path.join(__dirname, 'error', 'error_package');
      return checker(dir).should.be.rejectedWith(Error, {
        message: `Can not parse package.json in ${dir}`
      });
    });
    it('should reject an error if cwd is not a string', () => {
      return checker({}).should.be.rejectedWith(Error, {
        message: `Expected cwd to be a string`
      });
    });
  });
});
