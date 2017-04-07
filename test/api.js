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
suite('parse()', function(){
  test('empty string', function(){
    assert.equal(ejsLint.parse(''), '');
  });
  test('text', function(){
    assert.equal(ejsLint.parse('abc'), '   ');
  });
  test('scriptlet', function(){
    assert.equal(ejsLint.parse('<% foo(); %>'), '   foo();   ');
  });
  test('literal', function(){
    assert.equal(ejsLint.parse('<%% %>'), '      ');
  });
  test('old-style include', function(){
    assert.equal(ejsLint.parse('<% include foo.ejs %>'), '                     ');
  });
  test('custom delimiter', function(){
    assert.equal(ejsLint.parse('<$ var name="John"; $><$_ var greeting="Hello" _$><$= greeting $><$- name -$>!', {delimiter: '$'}),
                               '   var name="John";       var greeting="Hello"                                ');
  });
  test('multi-line file', function(){
    assert.equal(ejsLint.parse(fixture('valid.ejs')), fixture('valid.parsed.ejs'));
  });
});
suite('lint()', function(){
  test('empty string', function(){
    assert.equal(ejsLint.lint(''), undefined);
  });
  test('text', function(){
    assert.equal(ejsLint.lint('abc'), undefined);
  });
  test('valid scriptlet', function(){
    assert.equal(ejsLint.lint('<% foo(); %>'), undefined);
  });
  test('old-style include', function(){
    assert.equal(ejsLint.lint('<% include foo.ejs %>'), undefined);
  });
  test('valid multi-line file', function(){
    assert.equal(ejsLint.lint(fixture('valid.ejs')), undefined);
  });
  test('invalid multi-line file', function(){
    var err = ejsLint.lint(fixture('invalid.ejs'));
    assert.equal(err.line, 3);
    assert.equal(err.column, 4);
    assert.equal(err.message, 'Unexpected token');
  });
});
suite('misc.', function(){
  test('EJS version is pinned', function(){
    assert.equal(packageJSON.dependencies.ejs.search(/[\^~<=>]/), -1);
  });
});
