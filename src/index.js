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

        this.dataServer = net.createServer(socket => {
            self.dataSocket = socket
            socket.on('data', data => {
                console.log(data.toJSON())
            })
        })

        console.log(`connect to ${this.config.host}:${this.config.port}...`)

        const client = net.connect(this.config.port, this.config.host, () => {
            console.log('connected successfully')
            self.dataServer.listen(client.localPort + 1, self.config.local)
        })

        this.client = client
        
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
                
            }
        })
    }
}

module.exports = FunnyFTP

// const client = net.connect(21, '106.14.194.253', () => {
//     console.log('创建连接')
// })

// let dataConnect = null

// client.on('data', data => {
//     console.log(data.toString())
//     let code = data.toString().substring(0, 3)
//     if (code === '220') {
//         client.write('USER panna_hhs\r\n')
//     }
//     if (code === '331') {
//         client.write('PASS B6oGm8B4\r\n')
//     }
//     if (code === '230') {
//         client.write('PWD\r\n')
//     }
//     if (code === '257') {
//         console.log('打印成功')
//     }
//     // client.end()
// })

// client.on('end', () => {
//     console.log('断开连接')
// })