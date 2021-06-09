const { Socket, createServer } = require("net");

const config = require('../ftpconfig')

const { port, host, local } = config

const client = new Socket()

console.log(client.localAddress)

client.connect(port, host, () => {
  console.log(client.localAddress)
})