const IGNDatabase = require('../handler/dist/models/userdata')
module.exports = (client, instance) => {
    client.on('guildMemberAdd', async (member) => {
      if (member.partial) await member.fetch()
      let data = instance.getConfig(guild)
      if (member.guild.me.permissions.has('MANAGE_MEMBERS') && data && data.setNicknames) {
        let userdata = instance.getUserData(member.user.id)
        if (!userdata || !userdata.gamertag) return
        member.setNickname(userdata.gamertag)
      }
    })
    client.on('messageCreate', (message) => {
        if (message.guild) {
          const {
            guild,
            channel
          } = message
          let data = instance.getConfig(guild)
          if (data && data.gamertagChannelID && data.gamertagChannelID == channel.id) {
            let perms = channel.permissionsFor(guild.me)
            if (perms.has('SEND_MESSAGES') && perms.has('MANAGE_MESSAGES')) {
              message.delete()
              channel.send({
                embeds: [{
                  title: 'Gamertag Registered',
                  author: {
                    name: author.tag,
                    icon_url: author.displayAvatarURL()
                  },
                  description: 'Your gamertag was registered as ' + message.content + '!',
                  footer: 'To set your gamertag simply emter it in this channel!'
                }]
              })
              if (data.setNicknames) {
                message.member.setNickname(message.content)
                IGNDatabase.findOneAndUpdate({
                  _id: message.author.id,
                  gamertag: message.content
                }, {
                  _id: message.author.id,
                  gamertag: message.content
                }, {
                  upsert: true
                })
                instance.userdata.set(message.author.id, {
                    gamertag: message.content,
                    ...instance.getUserData(message.author)
                  })
                }
              }
            }
          }
        })
    }