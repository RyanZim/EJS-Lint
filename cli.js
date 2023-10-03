#!/usr/bin/env node
/* eslint-disable no-console */
import fs from 'fs';
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
  })
  .option('ignorefile', {
    describe:
      'Optionally specify a file containing a list of glob expressions to ignore',
    type: 'string',
  })
  .option('ignore', {
    describe:
      'Optionally specify a glob pattern to ignore. You can specify multiple values. Terminate the list by adding --, or use this as the last argument',
    type: 'array',
  });

const ejsLintIgnoreExists = fs.existsSync('.ejslintignore');
const ignoreFilePaths = [];
if (ejsLintIgnoreExists) {
  ignoreFilePaths.push('.ejslintignore');
}
if (argv.ignorefile) {
  ignoreFilePaths.push(argv.ignorefile);
}
console.log(`--ignore, ${argv.ignore}`);
const ignorePatterns = [...(Array.isArray(argv.ignore) ? argv.ignore : [])];
ignoreFilePaths.forEach((filepath) => {
  const lines = fs
    .readFileSync(filepath, 'utf-8')
    .split('\n')
    .filter((line) => !!line);
  ignorePatterns.push(...lines);
});
const opts = {
  delimiter: argv.delimiter,
  preprocessorInclude: argv['preprocessor-include'],
  await: argv.await,
  ignore: ignorePatterns,
};
console.log(`Ignoring: ${opts.ignore}`);
read(
  globbySync(
    argv._.map((s) => slash(s)),
    {
      ignore: opts.ignore,
    },
  ),
)
  .then((res) => {
    let errored = false;
    console.log(res);
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
