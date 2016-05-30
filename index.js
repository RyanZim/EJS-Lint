var rewire=require('rewire'),
    ejs=rewire('ejs'),
    EJS_INCLUDE_REGEX=require('ejs-include-regex'),
    check = require('syntax-error');
// Internal Function
// Replaces text with whitespace
function padWhitespace(text){
  var x,
      res='';
  // if text contains newlines,
  // space them properly
  if(text.indexOf("\n") !== -1){
    // a crude way of counting newlines
    text.split("\n").forEach(function(t, n){
      if(n !== 0){
        // Add newline
        res+="\n";
      }
      // Pad with whitespace between each newline
      for(x=0;x<t.length;x++){
        res+=' ';
      }
    });
  } else {
    // Only pad with whitespace if no newline
    for(x=0;x<text.length;x++){
      res+=' ';
    }
  }
  return res;
}
exports.parse = function(text, options){
  // Use rewire to access the ejs internal function "Template"
  var Template=ejs.__get__("Template"),
      opts=options || {},
      temp=new Template(text, opts);
  // Use ejs to parse the text
  var arr=temp.parseTemplateText();
  // console.log(arr);
  // ^^^^ enable this for development purposes
  // This allows you to see the values you will be working with below
  // Initialize variables:
  // Initialize var to hold the JS-Parseable String
  var scr='';
  // Initialize mode var
  // This is used to indicate the status:
  // Inside Scriptlet, mode=1
  // Outside Scriptlet, mode=0
  var mode;
  // Initialize delimiter variable
  var d=opts.delimiter || '%';
  arr.forEach(function(str, i, arr){
    switch(str){
      case '<'+d:
      case '<'+d+'_':
        mode=1;
        scr+=padWhitespace(str);
        break;
      case d+'>':
      case '-'+d+'>':
      case '_'+d+'>':
        mode=0;
        scr+=padWhitespace(str);
        break;
      case (str.match(EJS_INCLUDE_REGEX) || {}).input:
        // if old-style include, replace with whitespace
        scr+=padWhitespace(str);
        break;
      default:
        // If inside Scriptlet, add to scr
        if (mode === 1){
          scr+=str;
        } else {
          // else, pad with whitespace
          scr+=padWhitespace(str);
        }
    } // end of switch
  }); // end of loop
  // console.log(scr);
  // ^^^^ enable this to debug wrong line or col numbers
  return scr;
};
exports.lint = function(text, opts){
  // parse
  var scr=exports.parse(text, opts);
  // check for errors
  var err=check(scr);
  return err; // if no errors, returns undefined
};
