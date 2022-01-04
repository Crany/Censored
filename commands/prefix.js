const mongoose = require('mongoose');
const PrefixMDB = require('../models/prefix.js');

module.exports = {
    name: "prefix",
    description: "Command for changing the prefix",
    async execute(client, message, configRequire, JSONwrite, MessageEmbed, Permissions, hasModsRole, args, errorMessage, prefix) {
        let error = 0;
        let prefixEmbed = new MessageEmbed();
        try {
            if (hasModsRole || message.member.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS)) {
                if (args[0] == null) {
                    prefixEmbed.setDescription("**Please add a prefix.**")
                    prefixEmbed.setColor("#FFBF00")
                    message.channel.send({ embeds: [prefixEmbed] })
                    error = 2;
                } else if (args[0] == "default") {
                    configRequire.prefix = "$";

                    client.guilds.cache.get(message.guild.id).members.cache.get(client.user.id).setNickname(`[${configRequire.prefix}] Censored`);

                    JSONwrite("config");
                } else if (configRequire.alphabet.includes(args[0].charAt(0))) {
                    prefixEmbed.setDescription("**The prefix can't start with a letter.**")
                    prefixEmbed.setColor("FFBF00")
                    message.channel.send({ embeds: [prefixEmbed] });
                    error = 2;
                } else {
                    configRequire.prefix = args[0];
                    JSONwrite("config")

                    client.guilds.cache.get(message.guild.id).members.cache.get(client.user.id).setNickname(`[${configRequire.prefix}] Censored`);
                }
            } else {
                prefixEmbed.setDescription("**You have to be Mod or higher, or have the permission of `Manage Webhooks` to use this command.**")
                prefixEmbed.setColor("#FFBF00")
                message.channel.send({ embeds: [prefixEmbed]});
                error = 2;
            }

            const prefix = new PrefixMDB({
                _id: new mongoose.Types.ObjectId,
                prefix: require('../data/json/config.json').prefix,
                userID: message.author.id,
                userTag: message.author.tag,
            })

            prefix.save().catch();
        } catch (e) {
            console.log(e)
            errorMessage(message, prefixEmbed, "Prefix")

            configRequire.prefix = prefix;
            error = 1
            JSONwrite("config");
        }

        if (error == 0) {
            prefixEmbed.setDescription(`**Succesfully changed Prefix to \`${configRequire.prefix}\`.**`);
            prefixEmbed.setColor("GREEN");
            message.channel.send({ embeds: [prefixEmbed] })
        }
    }
}