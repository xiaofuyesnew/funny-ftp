const { host, port, user, pass } = require("../ftpconfig");
const { Socket, createServer } = require("net");
const fs = require("fs");
const path = require("path");

let client, localAddress, localPort, server;

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
const handleConnect = () => {
  console.log("已连接服务端");
  console.log(`localAddress: ${client.localAddress}`);
  localAddress = client.localAddress;
  localPort = client.localPort;
  // setTimeout(() => {
  //   client.destroy();
  // }, 5000);
};

const handleData = (e) => {
  const msg = e.toString().replace("\r\n", "");
  const code = +msg.split(" ")[0];
  console.log(msg);

  if (code === 220) {
    return client.write(`USER ${user}\r\n`);
  }

  if (code === 331) {
    return client.write(`PASS ${pass}\r\n`);
  }

  if (code === 230) {
    return client.write("TYPE I\r\n");
  }

  if (msg === "200 Type set to I") {
    return client.write(
      `PORT ${localAddress.split(".").join(",")},${Math.floor(
        (localPort + 1) / 256
      )},${(localPort + 1) % 256}\r\n`
    );
  }

  if (msg === '200 Port command successful') {
    console.log('端口配置完成')
    // return client.write('PWD\r\n')
    return client.write('CWD /dev/auto\r\n')
  }

  // if (code === 257) {
  //   return client.write('CWD /dev')
  // }
};

const handleClose = (e) => {
  console.log("链接关闭");
  console.log(e);
};

const handleEnd = () => {
  console.log("链接结束");
};

const createClient = (port, host) =>
  new Socket()
    .connect(port, host, handleConnect)
    .on("data", handleData)
    .on("close", handleClose)
    .on("end", handleEnd);

console.log("创建客户端...");
client = createClient(port, host);

const funny = async () => {};

module.exports = {
  funny,
};
