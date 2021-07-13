const Discord = require('discord.js');
const client  = new Discord.Client();

module.exports = {
    name: 'ping',
    description: 'this is a ping command',
    async execute (message, args) {
        let msg = await message.channel.send("Pong!");
        var ping = Math.round(client.ws.ping)
        msg.edit(`Pong \`${ping}\``)
    }
}