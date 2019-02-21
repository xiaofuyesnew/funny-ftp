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
                    errArr.push('host')
                }
                if (!config.pass) {
                    errArr.push('host')
                }
                if (!config.local) {
                    errArr.push('host')
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
        this.client = new net.Socket()
        const client = this.client

        console.log(`connect to ${this.config.host}:${this.config.port}...`)

        client.connect(this.config.port, this.config.host, () => {
            console.log('connected successfully')
            console.log(client.localPort)
            self.dataServer.listen(client.localPort + 1, self.config.local)
        })

        this.dataServer = net.createServer(socket => {
            self.dataSocket = socket
            socket.on('data', data => {
                console.log('ok')
                console.log(data.toJSON())
            })
        })
        
        client.on('data', msg => {
            console.log(msg.toString())
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
                    client.write('CWD 2017\r\n')
                }
            }
            if (code === 250) {
                client.end()
            }
        })

        client.on('end', () => {
            console.log('结束')
            client.write('CWD 2018\r\n')
        })
    }
}

module.exports = FunnyFTP
