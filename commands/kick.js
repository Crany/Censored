module.exports = {
    name: "kick",
    description: "Allows Advanced People and higher to kick people",
    execute(message, args, client, AdminPerm, AdminRole, StaffRole, ModsRoles) {
        let sentenceargs = args.splice(1).join(" ")

        if (message.member.roles.cache.has(AdminPerm || AdminRole || StaffRole || ModsRoles)) {
            let member = message.mentions.members.first()

            if (sentenceargs == null) {
                sentenceargs = "Unspecified - Reason was not provided.";
            }

            if (member == null) {
                message.channel.send(`Please specify the person you'd like to kick, <@${message.author.id}>`)
                return
            } else if (member.id == message.author.id) {
                message.channel.send(`You can't kick yourself, <@${message.author.id}>.`)
                return
            } else if (member.roles.cache.has(AdminPerm || AdminRole || StaffRole || ModsRoles)) {
                message.channel.send("You can't kick these people since they have staff or higher.")
                return
            } else if (member.user.bot) {
                message.channel.send("No. I don't think i will. :angry:")
                return
            } else {
                try {
                    member.send(
                        `**You have been kicked by ${message.author.tag}.**\n` +
                        `*Reason:* ${sentenceargs}\n\n` +
                        `**If you think this may have been accidental or for and incorrect reason, rejoin the server and DM Crany#6596 or a staff/mod member.**`
                    ).catch()
                    member.setNickname("[Kicked] " + member.user.username);
                    member.kick(sentenceargs)
                    message.channel.send(`${member.user.tag} was kicked.`)
                    let kickembed = new Discord.MessageEmbed()
                    .addField("REASON", sentenceargs, true)
                    .addField("MODERATOR/STAFF: ", `<@${message.author.id}>`, true)
                    .setColor("FF2500")
                    .setTitle(`${member.user.tag} was kicked`)
                    .setFooter(`${Time()} ${Day()} • UTC Time Zone`)

                    client.channels.cache.get(punishChannel).send(kickembed)
                } catch (err) {
                    message.channel.send("There was an error! This was up to the dev team so don't worry :D")
                    console.log(err);
                }
            }
        } else {
            message.channel.send(`Sorry but you don't have the required permissions to do that ${message.author}!`)
        }
    }
}