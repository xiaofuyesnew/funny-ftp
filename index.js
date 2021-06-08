#!/usr/bin/env node

const { funny } = require("./src/app.js");
const { version } = require("./package.json");
const { program } = require("commander");
const progress = require("process");
const chalk = require("chalk");
const ora = require("ora");
const inquirer = require("inquirer");

program
  .name("funny")
  .action((cmd, cmdObj) => {
    if (cmd) {
    }
  })
  .helpOption("-h, --help", "display help for funny-ftp")
  .version(
    chalk.gray(`funny-ftp ${version}`),
    "-v, --version",
    "output current version of funny-ftp"
  )
  .parse(process.argv);
