'use strict';

const { Client, Intents, MessageEmbed, Permissions } = require('discord.js');

require('dotenv').config()

const fs = require('fs');

const client = new Client({
    intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
    partials: [
        'CHANNEL',
        'GUILD_MEMBER',
        'MESSAGE',
        'REACTION',
        'USER'
    ]
})

const modRoles = ["680397530676068365", "856834038815916052", "680180666549141588", "865150729132048396", "876198442014244924"]

client.on("ready", () => {
    console.log("Ready :)")
})

// console.log("abcdefghijklmnopqrstuvwxyz".split(""))

client.on('messageCreate', (message) => {
    let prefix = require('./data/json/config.json').prefix;

    const hasModsRole = modRoles.some(role => {
        return message.member.roles.cache.has(role);
    });  

    const args = message.content.slice(prefix.length).trim().split(" ");
    const command = args.shift().toLowerCase();

    if (message.author.id == true) return
    else if (message.member.user.bot == true) return
    else if (message.mentions.members.size != 0) {
        if (message.mentions.members.first().user.id == client.user.id) {
            if (args[0] == "prefix") {
                const helpPrefixEmbed = new MessageEmbed()
                .setTitle(`This bot's prefix is \`${prefix}\`.`)
                .setColor("GREEN")

                message.channel.send({ embeds: [helpPrefixEmbed] })
            }
        }
    } else {
        if (message.channel.type != 'DM') {
            if (command == "ping") {
                message.reply("pong!");
            } else if (command == "prefix") {
                let prefixEmbed = new MessageEmbed();
                if (hasModsRole || message.member.permissions.has(Permissions.FLAGS.MANAGE_WEBHOOKS)) {
                    if (args[0] == null) {
                        prefixEmbed.setTitle("Please add a prefix.")
                        prefixEmbed.setColor("#FFBF00")
                        message.channel.send({ embeds: [prefixEmbed] })
                    } else if (args[0] != "") {
                        try {
                            const configRequire = require('./data/json/config.json');
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
                        }
                    }
                } else {
                    prefixEmbed.setTitle("You have to be Mod or higher, or have the permission of `Manage Webhooks` to use this command.")
                    prefixEmbed.setColor("#FFBF00")
                    message.channel.send({ embeds: [prefixEmbed]});
                }
            }
        } else {
            message.channel.send("Hello there! We're still working on seperate commands for DM's")
        }
    }
})

function JSONwrite(filename) {
    fs.writeFile(`./data/json/${filename}.json`, JSON.stringify(require(`./data/json/${filename}.json`), null, 2), (err) => {if (err) return console.log(err)});
}

function errorMessage(message, embed, err) {
    embed.setTitle(`There was an error with the \`${err}\` command. Please try again.`)
    embed.setColor("RED")
    message.channel.send({ embeds: [embed] })
}

client.login(process.env.TOKEN)