module.exports = {
    name: "botconfig",
    async execute(message, client, Discord) {
        let msg = await message.channel.send("Getting `Ping Speed`...");
        var ping = Math.round(client.ws.ping);
        msg.edit("Retrieving `Installed NPM Packages`...");
        let NPMpackages = ["Discord.js", "Discord.js-Buttons", "dotenv", "env"];
        msg.delete();

        message.channel.send(
            new Discord.MessageEmbed()
            .setTitle("Bot Stats")
            .addField("Developer(s):", "```Crany#6596```", false)
            .addFields(
                {name: "Ping Speed:", value: "```" + ping + "ms```", inline: true},
                {name: "RAM Usage (Rounded):", value: "```" + Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB```", inline: true}
            )
            .addField("NPM Packages:", "```" + NPMpackages.join(", ") + "```", false)
            .setColor("FF3C00")
        );
    }
}