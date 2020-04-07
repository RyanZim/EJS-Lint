'use strict';
/* eslint-env mocha */
const assert = require('assert');
const execFile = require('child_process').execFile;
const path = require('path');
const ejslint = path.resolve('cli.js');
const chalk = require('chalk');

suite('cli', () => {
  test('valid input', (done) => {
    execFile(ejslint, ['test/fixtures/valid.ejs'], (err, stdout, stderr) => {
      assert.ifError(err);
      assert(!stderr);
      done();
    });
  });
  test('invalid input', (done) => {
    execFile(ejslint, ['test/fixtures/invalid.ejs'], (err, stdout, stderr) => {
      const errorText = chalk.bgRed(']');
      const expectedContext = `\n<% ${errorText} %>`;
      assert.equal(err.code, 1, 'expected exit code of 1');
      assert.equal(
        stderr.trim(),
        `Unexpected token (3:4) in test/fixtures/invalid.ejs${expectedContext}`,
      );
      done();
    });
  });
  test('--preprocessor-include option', (done) => {
    execFile(
      ejslint,
      ['test/fixtures/preprocessor.ejs', '--preprocessor-include'],
      (err, stdout, stderr) => {
        assert.ifError(err);
        assert(!stderr);
        done();
      },
    );
  });
});
