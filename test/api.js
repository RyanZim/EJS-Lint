'use strict';
/* eslint-env mocha */
var ejsLint = require('../index.js');
var packageJSON = require('../package.json');
var readFile = require('fs').readFileSync;
var path = require('path');
var assert = require('assert');
function fixture(name){
  return readFile(path.join('test/fixtures/', name)).toString();
}
// ******************************** //
suite('ejs-lint', function(){
  test('empty string', function(){
    assert.equal(ejsLint(''), undefined);
  });
  test('text', function(){
    assert.equal(ejsLint('abc'), undefined);
  });
  test('valid scriptlet', function(){
    assert.equal(ejsLint('<% foo(); %>'), undefined);
  });
  test('old-style include', function(){
    assert.equal(ejsLint('<% include foo.ejs %>'), undefined);
  });
  test('valid multi-line file', function(){
    assert.equal(ejsLint(fixture('valid.ejs')), undefined);
  });
  test('invalid multi-line file', function(){
    var err = ejsLint(fixture('invalid.ejs'));
    assert.equal(err.line, 3);
    assert.equal(err.column, 4);
    assert.equal(err.message, 'Unexpected token');
  });
  test('EJSLint.lint() is an alias', function(){
    assert.equal(ejsLint, ejsLint.lint);
  });
});
suite('misc.', function(){
  test('EJS version is pinned', function(){
    assert.equal(packageJSON.dependencies.ejs.search(/[\^~<=>]/), -1);
  });
});
