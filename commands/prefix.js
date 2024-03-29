const mongoose = require('mongoose');
const prefixDB = require('../models/prefix.js');

function update(prefix) {
    let prefixdb = new prefixDB({ // Adds ability to update to MongoDB //
        _id: new mongoose.Types.ObjectId,
        prefix: prefix,
    })

    prefixdb.save().catch();
}
 
module.exports = {
    name: "prefix", // Identifying the command in index.js //
    description: "Command for changing the prefix",
    async execute(client, message, configRequire, JSONwrite, MessageEmbed, Permissions, hasModsRole, args, errorMessage, prefix) {
        let error = 0;
        let prefixEmbed = new MessageEmbed();

        try {
            if (hasModsRole || message.member.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS)) { // Checks if the person has the needed roles //
                if (args[0] == null) { // Checks if the person added the prefix //
                    prefixEmbed.setTitle("Please add a prefix.")
                    prefixEmbed.setColor("#FFBF00")
                    message.channel.send({ embeds: [prefixEmbed] })
                    error = 2;
                } else if (args[0] == "default") { // Sets to the default prefix //
                    configRequire.prefix = "$";
                    JSONwrite("config");
                    update(configRequire.prefix);
                    client.guilds.cache.get(message.guild.id).members.cache.get(client.user.id).setNickname(`[${configRequire.prefix}] Censored`);
                } else if (configRequire.alphabet.includes(args[0].charAt(0))) { // Checks if the prefix starts with a letter.
                    prefixEmbed.setTitle("The prefix can't start with a letter.")
                    prefixEmbed.setColor("FFBF00")
                    message.channel.send({ embeds: [prefixEmbed] });
                    error = 2;
                } else { // Sets and updates the prefix on the bot and MongoDB //
                    configRequire.prefix = args[0]; // Both this line and this
                    JSONwrite("config");            // line updates the prefix.
                    update(configRequire.prefix);   // This line updates it to MongoDB.
                    client.guilds.cache.get(message.guild.id).members.cache.get(client.user.id).setNickname(`[${configRequire.prefix}] Censored`);
                }
            } else { // If they don't have the needed roles //
                prefixEmbed.setTitle("You have to be Mod or higher, or have the permission of `Manage Webhooks` to use this command.")
                prefixEmbed.setColor("#FFBF00")
                message.channel.send({ embeds: [prefixEmbed]});
                error = 2;
            }
        } catch (err) { // Error Catching //
            console.log(err)
            errorMessage(message, prefixEmbed, "Prefix", err)

            configRequire.prefix = prefix;
            error = 1
            JSONwrite("config");
        }

        if (error == 0) { // Error Catching pt2 //
            prefixEmbed.setTitle(`Succesfully changed Prefix to \`${configRequire.prefix}\`.`);
            prefixEmbed.setColor("GREEN");
            message.channel.send({ embeds: [prefixEmbed] })
        }
    }
}