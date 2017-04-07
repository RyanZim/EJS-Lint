'use strict';
/* eslint-env mocha */
const ejsLint = require('../index.js');
const pkg = require('../package.json');
const readFile = require('fs').readFileSync;
const path = require('path');
const assert = require('assert');

function fixture(name) {
  return readFile(path.join('test/fixtures/', name)).toString();
}

suite('ejs-lint', () => {
  test('empty string', () => {
    assert.equal(ejsLint(''));
  });

  test('text', () => {
    assert.equal(ejsLint('abc'));
  });

  test('valid scriptlet', () => {
    assert.equal(ejsLint('<% foo(); %>'));
  });

  test('old-style include', () => {
    assert.equal(ejsLint('<% include foo.ejs %>'));
  });

  test('valid multi-line file', () => {
    assert.equal(ejsLint(fixture('valid.ejs')));
  });

  test('invalid multi-line file', () => {
    var err = ejsLint(fixture('invalid.ejs'));
    assert.equal(err.line, 3);
    assert.equal(err.column, 4);
    assert.equal(err.message, 'Unexpected token');
  });

  test('EJSLint.lint() is an alias', () => {
    assert.equal(ejsLint, ejsLint.lint);
  });
});

suite('misc.', () => {
  test('EJS version is pinned', () => {
    assert.equal(pkg.dependencies.ejs.search(/[\^~<=>]/), -1);
  });
});
