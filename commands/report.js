const mongoose = require('mongoose');
const reportDB = require('../models/report.js');
const randwords = require('random-words');

module.exports = {
    name: "report",
    description: "Ability to report people.",
    exexute(client, message, args, MessageEmbed, errorMessage) {
        let reportEmbed = new MessageEmbed();
            // Error Identifier //
            let error = false;

            try {
                if (args[0] == "fetch") { // Checks for data about user or through and ID (Identifier) //
                    
                } else {
                    // Adds abilty to add data to MongoDB //
                    const reportdb = new reportDB({
                        _id: new mongoose.Types.ObjectId,
                        reason: reason,
                        reportedID: reported.user.id,
                        informantID: informant.id,
                        reportID: new Date().getTime(),
                        identifier: identifier,
                    })

                    if (message.mentions.members.size > 0) { // Check if there's a mention in the message //
                        // Gets the information from the message //
                        let reported = message.mentions.members.first();
                        let informant = message.author;
                        let reason = args.slice(1).join(" ");
                        let identifier = randwords() + "." + randwords() + "." + randwords();

                        // Reports the reported //
                        if (reported == informant) { // Removes ability to report yourself //
                            reportEmbed.setTitle("You can't report yourself, dummy!");
                            reportEmbed.setColor("FFBF00");
                            message.channel.send({ embeds: [reportEmbed] });
                        } else if (reported.user.bot) { // Removes ability to report bots //
                            reportEmbed.setTitle("**Hell no.**");
                            reportEmbed.setColor("RED");
                            message.channel.send({ embeds: [reportEmbed] });
                        } else if (args.slice(1).join("") == "" || reason == null) { // Removes ability to report somebody without a reason //
                            reportEmbed.setTitle("Please provide a reason.");
                            reportEmbed.setColor("FFBF00");
                            message.channel.send({ embeds: [reportEmbed] });
                        } else {
                            // Reports to the user-dashboard //
                            let reportChannelEmbed = new MessageEmbed()
                            reportChannelEmbed.setTitle(`${reported.user.tag} was reported.`);
                            reportChannelEmbed.setColor("GREEN");
                            reportChannelEmbed.setTimestamp(new Date())
                            reportChannelEmbed.addFields(
                                {name: "Reported by: ", value: informant.tag, inline: true},
                                {name: "Reason:", value: reason, inline: true},
                            )
                            reportChannelEmbed.setFooter(`ID: ${identifier}`);
                            client.channels.cache.get('959889696606003320').send({ embeds: [reportChannelEmbed] });

                            reportEmbed.setTitle(`${reported.user.tag} was reported.`);
                            reportEmbed.setColor("GREEN");
                            reportEmbed.setTimestamp(new Date())
                            reportEmbed.setFooter(`Remember this ID: ${identifier}`)
                            message.channel.send({ embeds: [reportEmbed] })

                            // Saves report to MongoDB //
                            reportdb.save().catch();
                        } 
                    }else { 
                        reportEmbed.setTitle("Please mention who you're reporting.");
                        reportEmbed.setColor("FFBF00");
                        message.channel.send({ embeds: [reportEmbed] });
                    }
                    message.delete();
                }
            } catch (err) { // Error Catching //
                error = true;
                errorMessage(message, new MessageEmbed(), 'Report', err)
            }
    }
}