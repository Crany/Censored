const mongoose = require('mongoose');
const reportDB = require('../models/report.js');
const randwords = require('random-words');
const report = require('../models/report.js');

module.exports = {
    name: "report",
    description: "Ability to report people.",
    exexute(client, message, args, MessageEmbed) {
        let reportEmbed = new MessageEmbed();

        if (message.mentions.members.size > 0) {
            let reported = message.mentions.members.first();
            let informant = message.author;
            let reason = args.slice(1).join(" ");
            let identifier = randwords() + "." + randwords() + "." + randwords();

            const reportdb = new reportDB({
                _id: new mongoose.Types.ObjectId,
                reason: reason,
                reportedID: reported.user.id,
                informantID: informant.id,
                reportID: new Date().getTime(),
                identifier: identifier,
            })

            if (args[0] == "fetch") {

            } else {
                if (reported == informant) {
                    reportEmbed.setDescription("You can't report yourself, dummy!");
                    reportEmbed.setColor("FFBF00");
                    message.channel.send({ embeds: [reportEmbed] });
                } else if (reported.user.bot) {
                    reportEmbed.setDescription("**Hell no.**");
                    reportEmbed.setColor("RED");
                    message.channel.send({ embeds: [reportEmbed] });
                } else if (args.slice(1).join("") == "" || reason == null) {
                    reportEmbed.setDescription("Please provide a reason.");
                    reportEmbed.setColor("FFBF00");
                    message.channel.send({ embeds: [reportEmbed] });
                } else {
                    let reportChannelEmbed = new MessageEmbed()
                    reportChannelEmbed.setTitle(`${reported.user.tag} was reported.`);
                    reportChannelEmbed.setColor("GREEN");
                    reportChannelEmbed.setTimestamp(new Date())
                    reportChannelEmbed.addFields(
                        {name: "Reported by: ", value: informant.tag},
                        {name: "Reason:", value: reason},
                    )
                    reportChannelEmbed.setFooter(`ID: ${identifier}`);
                    client.channels.cache.get('959889696606003320').send({ embeds: [reportChannelEmbed] })

                    reportEmbed.setDescription(`${reported.user.tag} was reported.`);
                    reportEmbed.setColor("FFBF00");
                    message.channel.send({ embeds: [reportEmbed] })

                    reportdb.save().catch();
                }
            }
        } else {
            reportEmbed.setDescription("Please mention who you're reporting.");
            reportEmbed.setColort("FFBF00");
            message.channel.send({ embeds: [reportEmbed] });
        }
    }
}