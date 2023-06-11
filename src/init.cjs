#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const kleur = require("kleur");

async function init() {
  const configPath = path.resolve(__dirname, "./config.json");
  const templatePath = path.join(process.cwd(), "/.templates");
  const configJson = JSON.parse(fs.readFileSync(configPath, "utf8"));
  configJson.templatePath = templatePath;
  fs.writeFileSync(configPath, JSON.stringify(configJson, "", 2));
  console.log(kleur.green("✔ template-new init successfully!"));
}
exports.init = init;
