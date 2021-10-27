'use strict';

const { Client, Intents, MessageEmbed, Permissions, Collection} = require('discord.js');

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

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

client.on("ready", () => {
    console.log("Ready :)")
})

// console.log("abcdefghijklmnopqrstuvwxyz".split(""))

client.on('messageCreate', (message) => {
    let prefix = require('./data/json/config.json').prefix;

    const hasModRole = modRoles.some(role => {
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
                const configRequire = require('./data/json/config.json');
                client.commands.get("prefix").execute(client, message, configRequire, JSONwrite, MessageEmbed, Permissions, hasModRole, args)
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