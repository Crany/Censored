module.exports = {
    name: "prefix",
    description: "Command for changing the prefix",
    async execute(client, message, configRequire, JSONwrite, MessageEmbed, Permissions, hasModsRole, args) {
        let prefixEmbed = new MessageEmbed();
        if (hasModsRole || message.member.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS)) {
            if (args[0] == null) {
                prefixEmbed.setTitle("Please add a prefix.")
                prefixEmbed.setColor("#FFBF00")
                message.channel.send({ embeds: [prefixEmbed] })
            } else if (args[0] != "") {
                try {
                    if (args[0] == "default") {
                        prefixEmbed.setTitle("Succesfully changed Prefix to \`$\`.");
                        prefixEmbed.setColor("GREEN");

                        configRequire.prefix = "$";

                        client.guilds.cache.get(message.guild.id).members.cache.get(client.user.id).setNickname(`[${configRequire.prefix}] Censored`);

                        JSONwrite("config");

                        message.channel.send({embeds: [prefixEmbed]})
                    } else if (configRequire.alphabet.includes(args[0].charAt(0))) {
                        prefixEmbed.setTitle("The prefix can't start with a letter.")
                        prefixEmbed.setColor("FFBF00")
                        message.channel.send({ embeds: [prefixEmbed] });
                    } else {
                        configRequire.prefix = args[0];
                        JSONwrite("config")

                        prefixEmbed.setTitle(`Succesfully changed Prefix to \`${configRequire.prefix}\`.`)
                        prefixEmbed.setColor("GREEN")

                        message.channel.send({ embeds: [prefixEmbed] })

                        client.guilds.cache.get(message.guild.id).members.cache.get(client.user.id).setNickname(`[${configRequire.prefix}] Censored`);
                    }
                } catch (e) {
                    console.log(e)
                    errorMessage(message, prefixEmbed, "Prefix")

                    configRequire.prefix = prefix;
                    JSONwrite("config");
                }
            }
        } else {
            prefixEmbed.setTitle("You have to be Mod or higher, or have the permission of `Manage Webhooks` to use this command.")
            prefixEmbed.setColor("#FFBF00")
            message.channel.send({ embeds: [prefixEmbed]});
        }
    }
}