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
    assert.ifError(ejsLint(''));
  });

  test('text', () => {
    assert.ifError(ejsLint('abc'));
  });

  test('valid scriptlet', () => {
    assert.ifError(ejsLint('<% foo(); %>'));
  });

  suite('old-style include', () => {
    test('without preprocessorInclude set', () => {
      const err = ejsLint('<% include foo.ejs %>');
      assert.equal(err.line, 1);
      assert.equal(err.column, 12);
      assert.equal(err.message, 'Unexpected token');
    });
    test('with preprocessorInclude set', () => {
      assert.ifError(
        ejsLint('<% include foo.ejs %>', { preprocessorInclude: true }),
      );
    });
  });

  test('valid multi-line file', () => {
    assert.ifError(ejsLint(fixture('valid.ejs')));
  });

  test('invalid multi-line file', () => {
    const err = ejsLint(fixture('invalid.ejs'));
    assert.equal(err.line, 3);
    assert.equal(err.column, 4);
    assert.equal(err.message, 'Unexpected token');
  });

  test('valid <%= expression', () => {
    assert.ifError(ejsLint('<% foo() %><%= bar[42] %><% doz() %>'));
  });

  test('invalid <%= expression', () => {
    const err = ejsLint('<%= foo[ %>');
    assert.equal(err.message, 'Unexpected token');
  });
});

suite('misc.', () => {
  test('EJS version is pinned', () => {
    assert.equal(pkg.dependencies.ejs.search(/[\^~<=>]/), -1);
  });
});
