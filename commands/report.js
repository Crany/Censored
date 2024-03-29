const mongoose = require('mongoose');
const reportDB = require('../models/report.js');
const randwords = require('random-words');
require('dotenv').config();

module.exports = {
    name: "report",
    description: "Ability to report people.",
    execute(client, message, args, MessageEmbed, errorMessage, hasModRoles) {
        let reportEmbed = new MessageEmbed();
        // Error Identifier //
        let error = false;

        try {
            if (args[0] == "fetch") {
                if (hasModRoles) { 
                    let fetchEmbed = new MessageEmbed();
                    let fetchEmbedResults = new MessageEmbed();

                    if (args[1] == "" || args[1] == null) { // Checks if they provided the ID or user of the report //
                        fetchEmbed.setTitle("Please provide the ID or User of the report.")
                        fetchEmbed.setColor("FFBF00");
                        message.channel.send({ embeds: [fetchEmbed] });
                    } else {
                        let reportFetchResult = [];
                        let reportFetch = [];

                        if (message.mentions.members.size > 0) { // Checks if they provided the User //
                            reportDB.find({}, (err, result) => {
                                reportFetchResult = result;
                            }).clone().then(() => {
                                setTimeout(() => {
                                    for (let i = 0; i != reportFetchResult.length; i++) {
                                        if (reportFetchResult[i]["reportedTag"] == message.mentions.members.first().user.tag) {
                                            reportFetch.push(reportFetchResult[i])
                                        }
                                    }
                                }, 1000)
                            });
                        } else { // If they provided an ID //
                            reportDB.find({}, (err, result) => {
                                reportFetchResult = result;
                            }).clone().then(() => {
                                setTimeout(() => {
                                    for (let i = 0; i != reportFetchResult.length; i++) {
                                        if (reportFetchResult[i]["identifier"] == args[1]) {
                                            reportFetch.push(reportFetchResult[i])
                                        }
                                    }

                                }, 1000)
                            })
                        }

                        setTimeout(() => { // Visulises what results were returned //
                            if (reportFetch.length == 0) {
                                fetchEmbed.setTitle("No result were returned.");
                                fetchEmbed.setColor("FFBF00");
                                message.channel.send({ embeds: [fetchEmbed] })
                            } else {
                                let fetchedEmbed = new MessageEmbed()
                                .setTitle("This is what was returned.")
                                .setColor("GREEN");
                                for (let i = 0; i != reportFetch.length; i++) {
                                    fetchedEmbed.addFields( // Rows of 3
                                        {name: "Reported:", value: reportFetch[i]["reportedTag"], inline: true},
                                        {name: "Reported By:", value: reportFetch[i]["informantTag"], inline: true},
                                        {name: "Reason:", value: reportFetch[i]["reason"], inline: true},
                                    );
                                }
                                message.channel.send({ embeds: [fetchedEmbed] })
                                
                            }
                        }, 1500)
                    }
                } else {
                    const illegalEmbed = new MessageEmbed()
                    .setTitle("You have to be Mod or higher to use this command.")
                    .setColor('FFBF00')
                    message.channel.send({ embeds: [illegalEmbed] })
                }
                
            } else if (args[0] == "test") { // Test Report //
                let reportChannelEmbed = new MessageEmbed()
                reportChannelEmbed.setTitle(`'TEST_USER2' was reported.`);
                reportChannelEmbed.setColor("GREEN");
                reportChannelEmbed.setTimestamp(new Date())
                reportChannelEmbed.addFields(
                    {name: "Reported by: ", value: "TEST_USER1", inline: true},
                    {name: "Reason:", value: "TEST_USER2", inline: true},
                )
                reportChannelEmbed.setFooter(`ID: test.test.test`);
                client.channels.cache.get('959889696606003320').send({ embeds: [reportChannelEmbed] });

                reportEmbed.setTitle(`TEST_USER2 was reported.`);
                reportEmbed.setColor("GREEN");
                reportEmbed.setTimestamp(new Date())
                reportEmbed.setFooter(`Remember this ID: test.test.test`)
                message.channel.send({ embeds: [reportEmbed] })

                const reportdb = new reportDB({
                    _id: new mongoose.Types.ObjectId,
                    reason: "Test reason.",
                    reportedTag: "TEST_USER1",
                    reportedID: "",
                    informantTag: "TEST_USER2",
                    identifier: "test.test.test",
                })

                reportdb.save().catch();
            } else {

                if (message.mentions.members.size > 0) { // Check if there's a mention in the message //
                    // Gets the information from the message //
                    let reported = message.mentions.members.first();
                    let informant = message.author;
                    let reason = args.slice(1).join(" ");
                    let identifier = randwords() + "." + randwords() + "." + randwords();

                    // Adds abilty to add data to MongoDB //
                    const reportdb = new reportDB({
                        _id: new mongoose.Types.ObjectId,
                        reason: reason,
                        reportedTag: reported.user.tag,
                        reportedID: reported.user.id,
                        informantTag: informant.tag,
                        identifier: identifier,
                    })

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