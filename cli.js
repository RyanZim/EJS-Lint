#!/usr/bin/env node
'use strict';
/* eslint-disable no-console */
const argv = require('yargs')
  .usage(
    `Usage:\n $0 <file> [-d=?]

  If no file is specified, reads from stdin`,
  )
  .option('d', {
    alias: 'delimiter',
    describe: 'Specify a custom delimiter ( i.e. <? instead of <% )',
    type: 'string',
  })
  .option('preprocessor-include', {
    describe: 'Allow old (pre-EJS v3) preprocessor-style includes',
    type: 'boolean',
  }).argv;
const glob = require('globby').sync;
const read = require('read-input');
const ejsLint = require('./index.js');
const path = require('path');
const fs = require('fs');

const opts = {
  delimiter: argv.delimiter,
  preprocessorInclude: argv['preprocessor-include'],
};
read(glob(argv._))
  .then((res) => {
    let errored = false;
    res.files.forEach((file) => {
      const err = ejsLint(file.data, opts);
      if (err) {
        errored = true;
        let message = `${err.message} (${err.line}:${err.column})`;
        if (file.name) {
          message += ` in ${file.name}`;
          message += '\n' + errorContext(err, file);
        }
        console.error(message);
      }
    });
    if (errored) process.exit(1);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

function errorContext(err, file = undefined) {
  const colors = require('colors');
  let lines = file.data.split(/\r?\n/);
  let lineText = lines[err.line - 1];
  let before = lineText.substr(0, err.column - 1);
  let during = lineText.substr(err.column - 1, 1);
  let after = lineText.substr(err.column);
  return before + during.bgRed + after;
}
