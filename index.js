#!/usr/bin/env node
const path = require("path");
const fs = require("fs");

const { createClient } = require("./src/app");
const { version } = require("./package.json");
const { program } = require("commander");
const progress = require("process");
const chalk = require("chalk");
const ora = require("ora");
const inquirer = require("inquirer");

const config = require(path.resolve(`${process.cwd()}/ftpconfig.js`));

program
  .name("funny")
  .option("-d, --directory", "upload directory")
  .option("--config", "specify a config file")
  .action((cmd) => {
    // console.log(chalk.blueBright(`local IP: ${getLocalIp()}`));
    // console.dir(config);
    // const { args } = cmd;
    // if (args.length) {
    //   console.log(cmd);
    //   console.log("cmd");
    // } else {
    //   console.log("no cdm");
    // }
    const client = createClient()
  })
  .helpOption("-h, --help", "display help for funny-ftp")
  .version(
    chalk.gray(`funny-ftp ${version}`),
    "-v, --version",
    "output current version of funny-ftp"
  )
  .parse(process.argv);
