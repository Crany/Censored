module.exports = {
    name: "ping",
    description: "Returns the network speed of the bot",
    execute(client, message, args, MessageEmbed) {
        var ping = client.ws.ping; // Gets the ping of the bot //

        let pingEmbed = new MessageEmbed()
        .setTitle(`Pong! \`${ping}ms\``)
        
        if (ping >= "500") { // Terrible Connection //
            pingEmbed.setColor("RED");
            pingEmbed.setDescription(`Pong! \`${ping}ms\`\nSeems like we're experiencing some networking issues.`)
        } else if (ping >= "250") { // Degraded Connection //
            pingEmbed.setColor("FFBF00");
        } else if (ping < "250") { // Good Connection //
            pingEmbed.setColor("GREEN");
        }

        message.channel.send({ embeds: [pingEmbed] })
    }
};