#!/usr/bin/env node
/* eslint-disable no-console */
import yargs from 'yargs';
import { globbySync } from 'globby';
import slash from 'slash';
import read from 'read-input';
import chalk from 'chalk';
import ejsLint from './index.js';

const { argv } = yargs(process.argv.slice(2))
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
  })
  .option('await', {
    describe: 'Allow usage of await in template',
    type: 'boolean',
  });

const opts = {
  delimiter: argv.delimiter,
  preprocessorInclude: argv['preprocessor-include'],
  await: argv.await,
};
read(globbySync(argv._.map((s) => slash(s))))
  .then((res) => {
    let errored = false;
    res.files.forEach((file) => {
      const err = ejsLint(file.data, opts);
      if (err) {
        errored = true;
        let message = `${err.message} (${err.line}:${err.column})`;
        if (file.name) message += ` in ${file.name}`;
        message += `\n${errorContext(err, file)}`;
        console.error(message);
      }
    });
    if (errored) process.exit(1);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

function errorContext(err, file) {
  const lines = file.data.split(/\r?\n/);
  const lineText = lines[err.line - 1];
  const before = lineText.substr(0, err.column - 1);
  const duringText = lineText.substr(err.column - 1, 1);
  const during = chalk.bgRed(duringText);
  const after = lineText.substr(err.column);
  const caret = '^';
  const lineBreak = '\n';
  const caretLine = addSpaces(err.column - 1) + caret;
  return before + during + after + lineBreak + caretLine;
}

function addSpaces(n) {
  let str = '';
  for (let i = 0; i < n; i++) {
    str += ' ';
  }
  return str;
}
