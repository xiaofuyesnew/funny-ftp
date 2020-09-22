const FunnyFTP = require('./index')

const app = new FunnyFTP({
  host: '106.14.194.253',
  user: 'panna_hhs',
  pass: 'B6oGm8B4',
  local: '192.168.0.104',
  dir: '/dev'
})

app.connect()