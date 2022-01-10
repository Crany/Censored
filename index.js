'use strict';

console.log("Setting up...")

const { Client, Intents, MessageEmbed, Permissions, Collection, MessageAttachment} = require('discord.js');
require('dotenv').config()
const fs = require('fs');
const mongoose = require('mongoose')
const createCaptcha = require('./auto/captcha/captcha')
let doingCaptcha = [];

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
    console.log("└── Connected to Discord.")
})

// console.log("abcdefghijklmnopqrstuvwxyz".split(""))

client.on('messageCreate', async (message) => {
    let prefix = require('./data/json/config.json').prefix;

    const configRequire = require('./data/json/config.json');
    
    const hasModRoles = modRoles.some(roles => {
        if (message.channel.type != 'DM') {
            client.guilds.cache.get('680154842316275834').members.cache.get(message.author.id).roles.cache.has(roles)
        }
    })
    // message.member.roles.cache.has(roles)

    if (message.author.id == true) return
    else if (message.author.bot == true) return
    else {
        if (message.channel.type != 'DM') {
            if (message.mentions.members.size != 0) {
                if (message.mentions.members.first().user.id == client.user.id) {
                    if (args[0] == "prefix") {
                        const helpPrefixEmbed = new MessageEmbed()
                        .setTitle(`This bot's prefix is \`${prefix}\`.`)
                        .setColor("GREEN")

                        message.channel.send({ embeds: [helpPrefixEmbed] })
                    }
                }
            }
        }
        
        if (message.channel.id != '685036523317625048' && message.channel.type != 'DM' && message.content.startsWith(prefix)) {
            
            const args = message.content.slice(prefix.length).trim().split(" ");
            const command = args.shift().toLowerCase();

            if (command == "ping") {
                var ping = client.ws.ping;

                let pingEmbed = new MessageEmbed()
                .setDescription(`**Pong!** \`${ping}ms\``)
                
                if (ping >= "500") {
                    pingEmbed.setColor("RED");
                    pingEmbed.setDescription(`**Pong!** \`${ping}ms\`\nWe seem to be experiencing some networking issues.`)
                } else if (ping >= "250") {
                    pingEmbed.setColor("FFBF00");
                } else if (ping < "250") {
                    pingEmbed.setColor("GREEN");
                }

                message.channel.send({ embeds: [pingEmbed] })
            } else if (command == "prefix") {
                client.commands.get("prefix").execute(client, message, configRequire, JSONwrite, MessageEmbed, Permissions, hasModRoles, args, errorMessage, prefix)
            }

            if (message.content.startsWith(prefix) && configRequire.availableCommands.includes(command)) console.log(`${message.author.tag} used the command "${command}"`);
        } else if (message.channel.id == '685036523317625048') {
            if (message.content == 'ready') {
                message.delete()
                
                // Captcha Stuff //
                
                if (!doingCaptcha.includes(message.author.id)) {
                    doingCaptcha.push(message.author.id);
                    const captcha = await createCaptcha();

                    try {
                        let captchaEmbed = new MessageEmbed();
                        captchaEmbed.setTitle("You will have 1 minute to complete this captcha. Do this by resending the text you see bellow.")
                        captchaEmbed.setDescription("Don't forget it's CaSe SeNsItIvE!")
                        captchaEmbed.setImage(`attachment://${captcha}.png`)
                        // Tutorial to get it working by: Anson the Developer (Jimp/Captcha)
                        captchaEmbed.setColor('BLUE')
                        setTimeout(() => message.author.send({ embeds: [captchaEmbed], files: [`./auto/captcha/captchas/${captcha}.png`] }).catch((e) => {console.log(`${message.author.tag} forgot to allow DM's.`)}), 500)
                        setTimeout(() => fs.unlink(`./auto/captcha/captchas/${captcha}.png`, (err) => {if (err) throw err}), 1000)

                        try {
                            const filter = (msg) => {
                                if (msg.author.bot) return
                                if (msg.author.id == message.author.id && msg.content === captcha) {
                                    return true
                                } else {
                                    captchaEmbed.setTitle(`You have answered the captcha incorrectly.`)
                                    captchaEmbed.setColor("RED")
                                    msg.author.send({ embeds: [captchaEmbed] })
                                    return false;
                                }
                            }

                            await message.author.createDM();
                            const response = await message.author.dmChannel.awaitMessages({filter, max: 1, time: 60000, errors: ['time']})
                            if (response) {
                                captchaEmbed.setTitle(`You have answered the captcha correctly.`)
                                captchaEmbed.setDescription(`Welcome to the server, ${message.author}!`)
                                captchaEmbed.setColor("GREEN")
                                message.author.send({ embeds: [captchaEmbed] })
                                client.guilds.cache.get('680154842316275834').members.cache.get(message.author.id).roles.add('680397965285654551')
                                doingCaptcha.splice(doingCaptcha.indexOf(message.author.id), 1)

                                // let welcomeEmbed = new MessageEmbed();
                                // welcomeEmbed.setDescription(`Please welcome ${message.author} to the server!`)
                                // welcomeEmbed.setColor('GREEN')
                                // client.guilds.cache.get('680154842316275834').channels.cache.get('927991039946555422').send({ embeds: [welcomeEmbed] })
                            }
                        } catch (e) {
                            console.error(e)
                            captchaEmbed.setTitle(`You did not complete the captcha fast enough.`)
                            captchaEmbed.setColor("RED")
                            await message.author.send({ embeds: [captchaEmbed] })
                            doingCaptcha.splice(doingCaptcha.indexOf(message.author.id), 1)
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
            } else {
                message.delete()
            }
        }
    }
})

function JSONwrite(filename) {
    fs.writeFile(`./data/json/${filename}.json`, JSON.stringify(require(`./data/json/${filename}.json`), null, 2), (err) => {
        if (err) return console.log(err)
    });
}

function errorMessage(message, embed, err) {
    embed.setTitle(`There was an error with the \`${err}\` command. Please try again.`)
    embed.setColor("RED")
    message.channel.send({ embeds: [embed] })
}

console.log('Connecting...')
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("├── Connected to the MongoDB Database.");
    client.login(process.env.TOKEN).catch((err) => {
        console.log("└── Failed to connect to Discord.");
        console.error(err);
        process.exit(1);
    })
}).catch((err) => {
    console.log("├── Failed to connect to the MongoDB Database.");
    console.error(err);
    process.exit(1);
});