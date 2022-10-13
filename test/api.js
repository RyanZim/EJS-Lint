/* eslint-env mocha */
import ejsLint from '../index.js';
import { readFileSync } from 'fs';
import path from 'path';
import assert from 'assert';

function fixture(name) {
  return readFileSync(path.join('test/fixtures/', name)).toString();
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

  suite('await in template', () => {
    test('without await set', () => {
      const err = ejsLint('<% await foo() %>');
      assert.equal(err.line, 1);
      assert.equal(err.column, 10);
      assert.equal(err.message, 'Unexpected token');
    });
    test('with await set', () => {
      assert.ifError(ejsLint('<% await foo %>', { await: true }));
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
