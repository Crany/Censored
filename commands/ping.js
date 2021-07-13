const discord = require('discord.js')
const client = discord.Client

module.exports = {
    name: 'ping',
    description: 'this is a ping command',
    execute (message, args) {
        let msg = await message.channel.send("Pong!");
        var ping = Math.round(client.ws.ping)
        msg.edit(`Pong \`${ping}\``)
    }
}