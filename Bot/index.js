const WOKCommands = require('./dist')
const path = require('path')
module.exports = (client) =>{
  client.on('ready',(req,res)=>{
   client.Handler = new WOKCommands(client, {
    // The name of the local folder for your command files

    commandsDir: path.join(__dirname, 'commands'),
     featuresDir: path.join(__dirname, 'features'),
     ignoreBots: true,
     debug:true,
     mongoUri: process.env.MONGO_URI
  })

})

  }