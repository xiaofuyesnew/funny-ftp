#!/usr/bin/env node

const path = require('path')
const fs = require('fs')

const { funny } = require("./src/app.js");
const { version } = require("./package.json");
const { program } = require("commander");
const progress = require("process");
const chalk = require("chalk");
const ora = require("ora");
const inquirer = require("inquirer");

const {getLocalIp} = require('./src/get_ip')

const config = require(path.resolve(`${process.cwd()}/ftpconfig.js`))

program
  .name("funny")
  .option('--config', 'specify a config file')
  .action((cmd, cmdObj) => {
    console.log(chalk.blueBright(`local IP: ${getLocalIp()}`))
    console.dir(config)
    if (cmd) {
      console.log('cmd')
    } else {
      console.log('no cdm')
    }
  })
  .helpOption("-h, --help", "display help for funny-ftp")
  .version(
    chalk.gray(`funny-ftp ${version}`),
    "-v, --version",
    "output current version of funny-ftp"
  )
  .parse(process.argv);
