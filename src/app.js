const config = require('./config')
const FunnyFTP = require('./index')

const app = new FunnyFTP(config)

app.ready()