#!/usr/bin/env node
var argv=require('yargs')
  .usage('Usage:\n $0 <file> [-d=?]\n\n If no file is specified, reads from stdin')
  .option('p', {
    alias: 'parse',
    describe: 'Run parse() instead of lint()',
    type: 'boolean'
  })
  .option('d', {
    alias: 'delimiter',
    describe: 'Specify a custom delimiter ( i.e. <? instead of <% )',
    type: 'string'
  })
  .help()
  .argv;
var glob=require('glob'),
    fs=require('fs'),
    read=require('read-input'),
    ejsLint=require('./index.js');
// INTERNAL FUNCTIONS
// Read from file & return contents
function getFile(filename){
  return fs.readFileSync(filename, 'utf8');
}
// Lint or parse
function lint(text, returnErrors){
  var err;
  if(argv.parse){
    console.log(ejsLint.parse(text, opts));
  } else {
    err=ejsLint.lint(text, opts);
  }
  if(err){
    // if error, log it unless returnErrors is true
    if(!returnErrors){
      console.log(err.message+'('+err.line+':'+err.column+')');
    } else {
      // if returnErrors is true, return the error
      return err;
    }
  }
  // exit unless noExit is true
  if(!returnErrors){
    process.exit();
  }
}
// *********************** //
// Initialize vars
var opts={};
// if --delimiter is specified, set delimiter
if(argv.delimiter){
  opts.delimiter=argv.delimiter;
}
if (argv._[0]){
  // if filename, check for globs
  if(glob.hasMagic(argv._[0])){
    // run glob
    glob(argv._[0], function(err, matches){
      var arr=[];
      // if matches is a string, turn it into an array
      if(typeof matches==='string'){
        arr[0]=matches;
      } else {
        arr=matches;
      }
      // lint each file
      arr.forEach(function(filename, i){
        // set returnErrors to true and handle errors
        var err=lint(getFile(filename), true);
        if(err){
          console.log(err.message+'('+err.line+':'+err.column+') in '+filename);
        }
      });
      // exit when all files are linted
      process.exit();
    });
  } else {
    // else, just lint
    lint(getFile(argv._[0]));
  }
} else {
  // else, read from stdin and lint
  read.stdin(function(err, text){
    if(err){
      console.error(err);
      process.exit(1);
    } else {
      lint(text);
    }
  });
}
