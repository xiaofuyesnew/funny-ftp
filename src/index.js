/*
 * @Author: Allen.Wong 
 * @Date: 2020-09-21 11:37:13 
 * @Last Modified by: Allen.Wong
 * @Last Modified time: 2020-09-21 18:26:31
 */

const { Socket, createServer } = require('net')
const fs = require('fs')
// const { config } = require('process')

class FunnyFTP {
  constructor(config) {
    if (config) {
      const { host, user, pass, local, port } = config
      let errArr = []
      if (!(host && user && pass && local)) {
        if (!host) {
          errArr.push('host')
        }
        if (!user) {
          errArr.push('user')
        }
        if (!pass) {
          errArr.push('pass')
        }
        if (!local) {
          errArr.push('local')
        }
        throw new Error(`no necessary value in key [${errArr.join(',')}]`)
      }
      this.config = { host, user, pass, local, port: port || 21 }
    } else {
      throw new Error('need config Object')
    }
  }
  connect() {
    const self = this
    const client = new Socket()
    const dataServer = createServer()

    const { port, host, local } = this.config

    return new Promise((resolve, reject) => {
      client.connect(port, host, () => {
        const { localPort } = client
        console.log(`创建连接成功，连接端口：${localPort}`)
        dataServer.listen(localPort + 1, local)
        resolve({client, dataServer})
      })
    })
  }
  listener() {
    this.connect().then(res => {
      // console.log(res)
      const {client, dataServer} = res
      client.on('data', msg => {
        console.log(msg)
      })
    })
  }
  login() {

  }
  clientProcessor(cmd) {

  }
  ready() {
    this.listener()
  }
}

module.exports = FunnyFTP

