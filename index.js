'use strict';

const { Client, Intents } = require('discord.js');
const { Message } = require('discord.js/src/index.js');

require('dotenv').config()

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

client.on("ready", () => {
    console.log("Ready :)")
})

client.on('messageCreate', (message) => {
    if (message.member.user.bot == true) {
        return;
    } else {
        if (message.content == "!ping") {
            message.reply("pong!");
        }
    }
})

client.login(process.env.TOKEN)