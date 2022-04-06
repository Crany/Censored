'use strict';

console.log("Setting up...")

const { 
    Client,
    Intents,
    MessageEmbed,
    Permissions,
    Collection,
    MessageAttachment,
    Message,
    MessageActionRow,
    MessageButton,
} = require('discord.js'); // Discord.js //
require('dotenv').config() // .env parser //
const fs = require('fs'); // File reading //
const mongoose = require('mongoose') // MongoDB/mongoose reading //
const createCaptcha = require('./auto/captcha/captcha') // Captcha //

// Mongoose Models //
const prefixModel = require('./models/prefix.js'); // Prefix

let doingCaptcha = [];

const client = new Client({ // Discord.js Client //
    intents: [ // Uses for the bot //
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
    partials: [ // Places where the bot can reach/read //
        'CHANNEL',
        'GUILD_MEMBER',
        'MESSAGE',
        'REACTION',
        'USER'
    ]
})

const modRoles = [
    "960204476885635152", // Owners Role
    "935986707529105428", // Admin Role
    "959881249751699527", // Admin Permissions Role
    "936767317872889917", // Mod Role
]

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) { // Command Files //
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on("ready", () => { // On ready... //
    console.log("└── Connected to Discord.")

    prefixModel.find({}, (err, result) => {
        if (err) return
        else configRequire.prefix = result[result.length - 1]['prefix']

        JSONwrite("config")
    })
})

const configRequire = require('./data/json/config.json'); // Configuration JSON file //

JSONwrite("config") // Updates JSON configuration file //

// console.log("abcdefghijklmnopqrstuvwxyz".split("")) // Get every letter in the alphabet in a list //

client.on('messageCreate', async (message) => { // Main part - When a message has been sent //
    let prefix = configRequire.prefix;

    
    // * Gets the Argments of an command:
    // *  - For example, !!hello there mate, how are you?.. becomes:
    // *    - args = ['there', 'mate,', 'how', 'are', 'you?'];
    // *  - and !!hello.. becomes
    // *    - command = 'hello';
    const args = message.content.slice(prefix.length).trim().split(" ");
    const command = args.shift().toLowerCase();

    if (!message.author.bot) { // Checks if the message author is a bot //
        if (message.channel.id == "934535120357048320") { // Checks if the channel is the meme channel //
            if (!(message.attachments.size > 0)) {
                message.delete()
                message.author.send("The law of the meme discord channel says you may only post memes in this channel.").catch();
            }
        }
        
        const hasModRoles = modRoles.some(roles => { // Checks if the message author has any Moderation roles //
            if (message.channel.type != 'DM') {
                return message.member.roles.cache.has(roles)
            }
        })

        if (message.author.id == true) return       // I have no idea what these
        else if (message.author.bot == true) return // 2 lines of code does
        else {
            if (message.channel.type != 'DM') {
                if (message.mentions.members.size != 0) {
                    if (message.mentions.members.first().user.id == client.user.id) { // Checks if the bot has been mentioned //
                        if (args[0] == "prefix") { // Checks if the message author is asking for the bots prefix //
                            const helpPrefixEmbed = new MessageEmbed()
                            .setTitle(`This bot's prefix is \`${prefix}\`.`)
                            .setColor("GREEN")

                            message.channel.send({ embeds: [helpPrefixEmbed] })
                        }
                    }
                }
            }
            
            if (message.channel.id != '936768644531249192' && message.channel.type != 'DM' && message.content.startsWith(prefix)) { // I don't know how to explain this line of code //

                if (command == "ping") { // Checks the bots internet speed //
                    if (configRequire.maintenance == false) {
                        client.commands.get('ping').execute(client, message, args);
                    }
                } else if (command == "prefix") { // Changes the bots prefix //
                    if (configRequire.maintenance == false) {
                        client.commands.get("prefix").execute(client, message, configRequire, JSONwrite, MessageEmbed, Permissions, hasModRoles, args, errorMessage, prefix)
                    }
                } else if (command == "report") { // Reports an user //
                    if (configRequire.maintenance == false) {
                        client.commands.get("report").execute(client, message, args, MessageEmbed, errorMessage, hasModRoles)
                    }
                } else if (command == "dice") { // Rolls a dice //
                    if (configRequire.maintenance == false) {
                        client.commands.get('dice').execute(client, message, args, MessageEmbed);
                    }
                }

                if (message.content.startsWith(prefix) && configRequire.availableCommands.includes(command)) console.log(`${message.author.tag} used the command "${command}" along with the arguements [${args.join(", ")}]`);

            } else if (message.channel.id == '936768644531249192') {
                if (message.content == 'ready') {
                    message.delete()
                    
                    // * // Captcha Stuff //
                    // * Tutorial to get it working by: Anson the Developer (Jimp/Captcha)
                    // * With help from people from the Discord.js Server
                    // * 
                    // * If you want to fully understand how this code works,
                    // * I would recommend watching the video Anson The
                    // * Developer made when they made this code.
                    // * 
                    // * I only messed around with part of the code for it to
                    // * fit the needs of my server.
                    
                    if (!doingCaptcha.includes(message.author.id)) {
                        doingCaptcha.push(message.author.id);
                        const captcha = await createCaptcha();

                        try {
                            let doCaptcha = true
                            let captchaEmbed = new MessageEmbed();
                            let beginningEmbed = new MessageEmmbed()
                            beginningEmbed.setTitle("You will have 1 minute to complete this captcha. Do this by resending the text you see bellow.")
                            beginningEmbed.setDescription("Don't forget it's CaSe SeNsItIvE!")
                            beginningEmbed.setImage(`attachment://${captcha}.png`)
                            beginningEmbed.setColor('BLUE')
                            setTimeout(() => message.author.send({ embeds: [beginningEmbed], files: [`./auto/captcha/captchas/${captcha}.png`] }).catch((e) => {
                                console.log(`${message.author.tag} forgot to allow DM's`)
                                fs.unlink(`./auto/captcha/captchas/${captcha}.png`, (err) => {if (err) throw err})
                                doCaptcha = false
                            }).then(async () => {
                                if (doCaptcha == true) {
                                    console.log(`${message.author.tag} is doing the CAPTCHA.`)
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
                                            client.guilds.cache.get(process.env.SERVER_ID).members.cache.get(message.author.id).roles.add(process.env.MEMBERS_ROLE)
                                            doingCaptcha.splice(doingCaptcha.indexOf(message.author.id), 1)
                                            console.log(`${message.author.tag} successfully completed the CAPTCHA.`)

                                            let welcomeEmbed = new MessageEmbed();
                                            welcomeEmbed.setDescription(`Please welcome ${message.author} to the server!`)
                                            welcomeEmbed.setColor('GREEN')
                                            client.guilds.cache.get(process.env.SERVER_ID).channels.cache.get('934525684775260183').send({ embeds: [welcomeEmbed] })
                                        }
                                    } catch (e) {
                                        // console.error(e)
                                        captchaEmbed.setTitle(`You did not complete the captcha fast enough.`)
                                        captchaEmbed.setColor("RED")
                                        await message.author.send({ embeds: [captchaEmbed] })
                                        doingCaptcha.splice(doingCaptcha.indexOf(message.author.id), 1)
                                        await console.log(`${message.author.tag} failed the CAPTCHA.`)
                                    }
                                } else {
                                    doingCaptcha.splice(doingCaptcha.indexOf(message.author.id), 1)
                                }
                            }), 500)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                } else {
                    message.delete()
                }
            }
        }
    } else return;
})

/**
 * @param {String} filename The filename (without the json) that updates. 
 */
function JSONwrite(filename) {
    fs.writeFile(`./data/json/${filename}.json`, JSON.stringify(require(`./data/json/${filename}.json`), null, 2), (err) => {
        if (err) return console.log(err)
    });
}

/**
 * 
 * @param {Message} message 
 * @param {MessageEmbed} embed 
 * @param {String} err 
 */
function errorMessage(message, embed, command, err) {
    embed.setTitle(`There was an error with the \`${command}\` command. Please try again.`)
    embed.setColor("RED")
    message.channel.send({ embeds: [embed] })
    console.log(err);
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
    console.log("└── Failed to connect to the MongoDB Database.");
    console.error(err);
    process.exit(1);
});