const WOKCommands = require('./handler')
const path = require('path')
module.exports = (client) => {
  client.on('ready', (req, res) => {
    client.handler = new WOKCommands(client, {
      // The name of the local folder for your command files

      commandsDir: path.join(__dirname, 'commands'),
      featuresDir: path.join(__dirname, 'features'),
      ignoreBots: true,
      debug: true,
      mongoUri: process.env.MONGO_URI
    })
    console.log(client.handler._config)
  })

}