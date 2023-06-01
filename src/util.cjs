#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

// 修改默认命令行帮助
const humanReadableArgName = (arg) => {
  const nameOutput = arg.name() + (arg.variadic === true ? "..." : "");
  return arg.required ? "<" + nameOutput + ">" : "[" + nameOutput + "]";
};

const subcommandTerm = (cmd) => {
  // Legacy. Ignores custom usage string, and nested commands.
  const args = cmd._args.map((arg) => humanReadableArgName(arg)).join(" ");
  return (
    cmd._name +
    (cmd._aliases[0] ? "|" + cmd._aliases[0] : "") +
    (args ? " " + args : "") +
    (cmd.options.length ? " [options]" : "") // simplistic check for non-help option
  );
};

/**
 * 清空文件夹
 * @param {*} folderPath
 * @return {*}
 */
const delDir = (folderPath, includeParent = true) => {
  let files = [];
  if (fs.existsSync(folderPath)) {
    files = fs.readdirSync(folderPath);
    files.forEach((file) => {
      let curPath = path.join(folderPath, file);
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
    includeParent && fs.rmdirSync(folderPath);
  }
};
module.exports = {
  subcommandTerm,
  delDir,
};
