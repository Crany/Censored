'use strict';

console.log("Setting up...")

const { Client, Intents, MessageEmbed, Permissions, Collection} = require('discord.js');
require('dotenv').config()
const fs = require('fs');
const mongoose = require('mongoose')
const createCaptcha = require('./auto/captcha')

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
	client.commands.set(command.name, command);
}

client.on("ready", () => {
    console.log("└──Connected to Discord.")
})

// console.log("abcdefghijklmnopqrstuvwxyz".split(""))

client.on('messageCreate', async (message) => {
    let prefix = require('./data/json/config.json').prefix;

    const configRequire = require('./data/json/config.json');

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
            if (message.channel.id != '685036523317625048' && message.content.startsWith(prefix)) {
                const args = message.content.slice(prefix.length).trim().split(" ");
                const command = args.shift().toLowerCase();

                if (command == "ping") {
                    var ping = client.ws.ping;
    
                    let pingEmbed = new MessageEmbed()
                    .setTitle(`Pong! \`${ping}ms\``)
                    
                    if (ping >= "500") {
                        pingEmbed.setColor("RED");
                        pingEmbed.setDescription("We seem to be experiencing some networking issues.")
                    } else if (ping >= "250") {
                        pingEmbed.setColor("FFBF00");
                    } else if (ping < "250") {
                        pingEmbed.setColor("GREEN");
                    }
    
                    message.channel.send({ embeds: [pingEmbed] })
                } else if (command == "prefix") {
                    client.commands.get("prefix").execute(client, message, configRequire, JSONwrite, MessageEmbed, Permissions, modRoles.some(roles => message.member.roles.cache.has(roles)), args, errorMessage, prefix)
                }

                if (message.content.startsWith(prefix) && configRequire.availableCommands.includes(command)) console.log(`${message.author.tag} used the command "${command}"`);
            } else if (message.channel.id == '685036523317625048') {
                if (message.content == 'ready') {
                    message.member.send("hello")
                    message.delete()
                } else {
                    message.delete()
                }
            }
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

console.log('Connected...')
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("├── Connected to the MongoDB Database.")
    client.login(process.env.TOKEN).catch((err) => {
        console.log("Failed to connect to Discord.");
        console.error(err)
    })
}).catch((err) => {
    console.log("Failed to connect to the MongoDB Database.")
    console.error(err)
});