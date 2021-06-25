const client

const handleData = (data) => {
  // get data & do next
}

client.on('data', handleData)

const main = () => {
  client.on('data', () => {
    // do another things
  })
  client.write(`cmd`)
  // get listener result & do next?
}

main()

