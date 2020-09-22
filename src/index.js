/*
 * @Author: Allen.Wong 
 * @Date: 2020-09-21 11:37:13 
 * @Last Modified by: Allen.Wong
 * @Last Modified time: 2020-09-21 18:38:17
 */

const { Socket, createServer } = require('net')
const fs = require('fs')
const path = require('path')
// const { config } = require('process')

class FunnyFTP {
  constructor(config) {
    if (config) {
      const { host, user, pass, local, port, dir } = config
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
      this.config = { host, user, pass, local, dir: dir || '/', port: port || 21 }
    } else {
      throw new Error('need config Object')
    }
  }
  connect() {
    const self = this
    const client = new Socket()
    // socket => {
    //   // console.log(socket)
    //   dataClient = socket
    //   dataClient.on('data', msg => {
    //     console.log(msg.toString().replace('\r\n', ''))
    //     let code = +msg.toString().substr(0, 3)
    //   })
    // }

    let flag = false

    const { port, host, local } = this.config

    console.log(`正在连接 ${host}:${port}...`)

    client.connect(port, host, () => {

      console.log('建立连接，等待欢迎信息...')

      const { localPort } = client

      client.on('data', msg => {
        const { user, pass, dir } = self.config
        console.log(msg.toString().replace('\r\n', ''))
        let code = +msg.toString().substr(0, 3)
        // login
        switch (code) {
          case 220:
            client.write(`USER ${user}\r\n`)
            break
          case 331:
            client.write(`PASS ${pass}\r\n`)
            break
          case 230:
            client.write('TYPE I\r\n')
            break
          case 200:
            if (msg.indexOf('Type') !== -1) {
              client.write(`PORT ${local.split('.').join(',')},${Math.floor((localPort + 1) / 256)},${(localPort + 1) % 256}\r\n`)
              flag = false
            } else {
              client.write('PWD\r\n')
            }
            break
          case 257:
            client.write(`CWD ${dir}\r\n`)
            break
          case 250:
            // client.write('QUIT\r\n')
            client.write('RETR ab.txt\r\n')

            // client.write('STOR ab.txt\r\n')
            // console.log(dataClient)
            // dataClient.write(fs.readFileSync(path.resolve('src/a.txt')))
            break
          case 150:
            createServer(c => {
              console.log('开始传输文件...')
              // console.log(c)
              // fs.readFile(path.resolve('src/ab.txt'), (err, data) => {
              //   if (!err) {
              //     c.write(data, () => {
              //       console.log('传输完成')
              //       c.destroy()
              //     })
              //   }
              // })
              c.on('data', data => {
                console.log('传输完成')
                console.log(data.toJSON())
                fs.writeFileSync('./abc.txt', data)
              })
              c.on('close', () => {
                console.log('close')
                process.exit()
              })
            }).listen(localPort + 1, local)
        }
      }).on('end', () => process.exit())
    })
  }
}
module.exports = FunnyFTP

