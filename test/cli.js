/* eslint-env mocha */
import assert from 'assert';
import { execFile } from 'child_process';
import path from 'path';

const ejslint = path.resolve('cli.js');

suite('cli', () => {
  test('.ejslintignore + custom_ignore', (done) => {
    execFile(
      ejslint,
      ['test/fixtures/*', '--ignore-file', 'test/.custom_ignore'],
      (err, stdout, stderr) => {
        assert.ifError(err);
        assert(!stderr);
        done();
      },
    );
  });
  test('.ejslintignore + custom_ignore via CLI (multiple args)', (done) => {
    execFile(
      ejslint,
      [
        'test/fixtures/*',
        '--ignore',
        'test/fixtures/await.ejs',
        'test/fixtures/invalid.ejs',
        'test/fixtures/preprocessor.ejs',
      ],
      (err, stdout, stderr) => {
        assert.ifError(err);
        assert(!stderr);
        done();
      },
    );
  });
  test('.ejslintignore + custom_ignore via CLI (1 arg)', (done) => {
    execFile(
      ejslint,
      [
        'test/fixtures/*',
        '--preprocessor-include',
        '--await',
        '--ignore',
        'test/fixtures/invalid.ejs',
      ],
      (err, stdout, stderr) => {
        assert.ifError(err);
        assert(!stderr);
        done();
      },
    );
  });
  test('.ejslintignore', (done) => {
    execFile(ejslint, ['test/fixtures/*'], (err) => {
      assert.equal(err.code, 1, 'expected exit code of 1');
      assert.doesNotMatch(
        err.message,
        /test\/fixtures\/ignored_by_ejslintignore\.ejs/,
      );
      done();
    });
  });
  test('valid input', (done) => {
    execFile(ejslint, ['test/fixtures/valid.ejs'], (err, stdout, stderr) => {
      assert.ifError(err);
      assert(!stderr);
      done();
    });
  });
  test('invalid input', (done) => {
    execFile(ejslint, ['test/fixtures/invalid.ejs'], (err, stdout, stderr) => {
      const expectedContext = `\n<% ] %>\n   ^`;
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
  test('--await option', (done) => {
    execFile(
      ejslint,
      ['test/fixtures/await.ejs', '--await'],
      (err, stdout, stderr) => {
        assert.ifError(err);
        assert(!stderr);
        done();
      },
    );
  });
});
