const { host, port, user, pass } = require("../ftpconfig");
const { Socket, createServer } = require("net");
const fs = require("fs");
const path = require("path");

let client = null

// 遍历文件结构

const mapDir = async (target, handle) => {
  const dir = path.resolve(target);
  // console.log(dir)
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    // console.log(filePath)
    const status = fs.statSync(filePath);
    // console.log(status.isDirectory())
    if (status.isDirectory()) {
      mapDir(filePath, handle);
    } else {
      handle(filePath);
    }
  });
};

// mapDir('dist', file => console.log(`upload:${file}`))
const handleConnect = async () => {
  console.log('已连接服务端')
  console.log(`localAddress: ${client.localAddress}`)
  setTimeout(() => {
    // client.destroy()
  }, 60000)
};

const handleData = async (e) => {
  console.log('接受数据')
  console.log(e.toString());
};

const handleClose = async (e) => {
  console.log('链接关闭')
  console.log(e);
};

const handleEnd = async () => {
  console.log('链接结束')
};

const createClient = async (port, host) => {
  console.log("创建客户端...");
  const client = new Socket();
  return client
    .connect(port, host, handleConnect)
    .on("data", handleData)
    .on("close", handleClose)
    .on("end", handleEnd);
};

client = createClient(port, host)

const funny = async () => {};

module.exports = {
  funny,
};
