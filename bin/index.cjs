#!/usr/bin/env node
const { Command } = require("commander");
const { init } = require("../src/init.cjs");
const { newFile } = require("../src/new.cjs");
const { subcommandTerm } = require("../src/util.cjs");
const program = new Command();
const packageJson = require("../package.json");

program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version);

program
  .command("init")
  .description("initialize template path to global configuration")
  .action(() => {
    init();
  });

program
  .command("new")
  .description("create new file by template")
  .argument("[templateName]", "template name")
  .option("-p <path>", "path for rendering template parameters")
  .action((args, options) => {
    newFile(args, options.p);
  });

program.configureHelp({
  subcommandTerm: subcommandTerm,
});
program.parse();
