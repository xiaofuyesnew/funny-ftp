/*
 * @Author: allen.wong 
 * @Date: 2019-02-21 16:54:53 
 * @Last Modified by: allen.wong
 * @Last Modified time: 2019-02-21 18:11:11
 */

const net = require('net')
const fs = require('fs')

// const config = {
//     host: serverIP<String>,
//     port: serverPort<Number>,  // optional default 21
//     user: username<String>,
//     pass: password<String>,
//     local: localIP<String>
// }

class FunnyFTP {
    constructor(config) {
        if (config) {
            if (!(config.host || config.user || config.pass || config.local)) {
                let errArr = []
                if (!config.host) {
                    errArr.push('host')
                }
                if (!config.user) {
                    errArr.push('user')
                }
                if (!config.pass) {
                    errArr.push('pass')
                }
                if (!config.local) {
                    errArr.push('local')
                }
                throw new Error(`no necessary value in key [${errArr.join(',')}]`)
            }
            this.config = {
                host: config.host,
                port: config.port || 21,
                user: config.user,
                pass: config.pass,
                local: config.local
            }
        } else {
            throw new Error('need config Object')
        }
    }
    connect() {

        const self = this
        let flag = false
        const client = new net.Socket()
        this.client = client

        console.log(`connect to ${this.config.host}:${this.config.port}...`)

        const dataServer = net.createServer(socket => {
            console.log('data conn')
            self.dataSocket = socket
            socket.on('data', data => {
                console.log('ok')
                console.log(data.toJSON())
            })
        })
        client.connect(this.config.port, this.config.host, () => {
            console.log('connected successfully')
            console.log(client.localPort)
            dataServer.listen(client.localPort + 1, self.config.local)
        })
        
        client.on('data', msg => {
            console.log(msg.toString().replace('\r\n'))
            let code = +msg.toString().substring(0, 3)
            // login
            if (code === 220) {
                client.write(`USER ${self.config.user}\r\n`)
            }
            if (code === 331) {
                client.write(`PASS ${self.config.pass}\r\n`)
            }
            if (code === 230) {
                // login successful
                client.write('TYPE I\r\n')
                flag = true
            }
            if (code === 200) {
                if (flag) {
                    client.write(`PORT ${self.config.local.split('.').join(',')},${parseInt((client.localPort + 1) / 256)},${(client.localPort + 1) % 256}\r\n`)
                    flag = false
                } else {
                    client.write('PWD\r\n')
                }
            }
            if (code === 257) {
                client.write(`RETR Web.config\r\n`)
            }
        })

        client.on('end', () => {
            console.log('结束')
            // client.write('CWD 2018\r\n')
        })
    }
}

module.exports = FunnyFTP
