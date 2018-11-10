#!/usr/local/bin/node


// Go trough hipchat export and calculate license price
// Step 1 script - Punchcard

const fs = require('fs'); // works with node 8 LTS

function compute_history(path) {
  fs.readFile(path, (err, content) => {
    if (err) {
      console.error("Error while reading : " + path);
      console.error(err);
      process.exit(-1);
    }
    JSON.parse(content).forEach(message => {
      var content = message.PrivateUserMessage ? message.PrivateUserMessage : message.UserMessage;
      if (content !== undefined) {
        var ts = content.timestamp.split('T')[0];
        console.log("{\"sender\":" + content.sender.id + ", \"ts\":\"" + ts + "\"},");
      }
    });
  });
}

function compute_hipchat_export(path) {
  fs.readdir(path, {withFileTypes: true}, (err, files) => {
    if (err) {
      console.error("Error while accessing sub directories");
      console.error(err);
      process.exit(-1);
    }
    files.forEach(entry => {
      var next_path = path + '/' + entry;
      fs.stat(next_path, (err, stat) => {
        if(err) {
          console.error("Error while accessing : " + next_path);
          process.exit(-1);
        }
        if (stat.isDirectory()) {
          compute_hipchat_export(next_path);
        }
        if (stat.isFile() && entry === 'history.json') {
          compute_history(next_path);
        }
      });
    });
  });
}

if (typeof(process.argv[2]) === 'undefined') {
  console.error("⚠ need hipchat export path");
  console.log("usae : node license_count.js <hipchat export path>");
  process.exit(-1);
}

var base_path = process.argv[2];

fs.stat(base_path, (err,stat) => {
  if (err) {
    console.error(base_path + " : doesn't exist or is not a directory");
    process.exit(-1);
  }
  compute_hipchat_export(base_path);
});


