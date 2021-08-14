module.exports = {
    name: "report",
    execute(message, client, punishChannel, Discord) {
        let member = message.mentions.members.first();

        if (member != null) {
            if (message.author.id != member.id) {
                if (!member.user.bot) {
                    let reason = message.content.split(" ").slice(2).join(" ");

                    if (reason == "" || reason == " ") {
                        reason = "None";
                    }

                    let reportEmbed = new Discord.MessageEmbed()
                    .setColor("47a9a8")
                    .setTitle(`${member.user.tag} was reported.`)
                    .setFooter(`${Time()} ${Day()} • UTC Time Zone`)
                    .addFields(
                        {name: "REASON", value: reason, inline: true},
                        {name: "MEMBER", value: message.author, inline: true}
                    )
                    client.channels.cache.get(punishChannel).send(reportEmbed)
                } else {
                    message.channel.send("What did us bots do now??")
                }
            } else {
                message.channel.send("You can't report yourself. Surprising?")
            }
        }
    }
}

function Time() {
    var clock = new Date();
    var hour = clock.getHours();
    var min = clock.getMinutes();
    
    if (hour < 10) {
        hour = "0" + hour;
    }
    else {
        hour = hour;
    }

    if (min < 10) {
        min = "0" + min;
    }
    else {
        min = min;
    }

    return hour + ":" + min;
}

function Day() {
    var clock = new Date();
    var day = clock.getDate()
    var month = clock.getMonth()
    var year = clock.getFullYear()

    return `${day}/${month}/${year}`

}