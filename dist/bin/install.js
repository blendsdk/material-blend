const exec = require('child_process').exec;

exec("typings install --save --global  file:node_modules/material-blend-sdk/typings/blend.d.ts", {
    cwd:"./../../"
}, function (error, stdout, stderr) {
    console.log("=====>", process.cwd);
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});