const Discord = require('discord.js');
const client  = new Discord.Client();

module.exports = {
    name: 'ping',
    description: 'this is a ping command',
    execute (message, args) {
        let member = message.mentions.members.first();

        if (member != null) {
            if (message.author.id != member.id) {
                if (!member.user.bot) {

                    const punishChannel = "857336677461655562"
                    let reason = message.content.split(" ").slice(2).join(" ");

                    if (reason == "" || reason == " ") {
                        reason = "None";
                    }

                    let reportID = Date.now().toString();

                    let reportEmbed = new Discord.MessageEmbed()
                    .setColor("47a9a8")
                    .setTitle(`${member.user.tag} was reported.`)
                    .setFooter(`Report ID: ${reportID} • Reported By: ${message.author.tag}`)
                    .addFields(
                        {name: "REASON", value: reason, inline: true},
                        {name: "LAST MESSAGE", value: "null (Could not locate last message.)", inline: true}
                    )
                    client.channels.cache.get(punishChannel).send(reportEmbed)

                    try {
                        const reportfileName = './data/json/reporteddata.json'
                        const reportfile = require('./data/json/reporteddata.json');

                        let count = reportfile.count + 1

                        if (member.id != reportfile.user1.userid) {
                            reportfile.user1.reportid = reportID;
                            reportfile.user1.userid = member.id;
                            reportfile.user1.reason = reason;
                        } else {
                            reportfile.user1.reportid = reportID;
                            reportfile.user1.reason = reason;
                        }

                        fs.writeFile(reportfileName, JSON.stringify(reportfile, null, 2), function writeJSON(err) {
                            if (err) return console.log(err);
                        });
                        
                    } catch (err) {console.error(err); process.exit(1)}
                } else {
                    message.channel.send("What did us bots do now??")
                }
            } else {
                message.reply("You can't report yourself! Surprising?")
            }
        } else {
            message.reply("Please specify the person you'd like to report.")
        }
    }
}