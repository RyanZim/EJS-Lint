#!/usr/bin/env node
'use strict';
const argv = require('yargs')
  .usage(`Usage:\n $0 <file> [-d=?]

  If no file is specified, reads from stdin`)
  .option('d', {
    alias: 'delimiter',
    describe: 'Specify a custom delimiter ( i.e. <? instead of <% )',
    type: 'string',
  })
  .help()
  .argv;
const glob = require('globby').sync;
const read = require('read-input');
const ejsLint = require('./index.js');

const opts = { delimiter: argv.delimiter };
read(glob(argv._))
.then(res => {
  let errored = false;
  res.files.forEach(file => {
    const err = ejsLint(file.data, opts);
    if (err) {
      errored = true;
      let message = `${err.message} (${err.line}:${err.column})`;
      if (file.name) message += ` in ${file.name}`;
      console.error(message);
    }
  });
  if (errored) process.exit(1);
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
