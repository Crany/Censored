  ////////////////////////////////////////////////////
 //// This bot belongs to Nymo Games Productions ////
////////////////////////////////////////////////////

//// Coded By: ////
// Crany#6596
// People from stackoverflow

// FF5733

// Discord Declaration //
const Discord = require('discord.js');
const client  = new Discord.Client();

// Other Declarations //
const fs = require('fs');
const os = require('os');


// Variable Declaration //
const ConfigData = require('./config.json');

const prefix = ConfigData.PREFIX;

const AdminRole = "680397530676068365";
const StaffRole = "680180666549141588";
const ModsRoles = "856834038815916052";
const AdminPerm = "860431100337324062";
const DefaultMembers = "680397965285654551";
const AdvancedRole = "696001274423803994";
const punishChannel = "857336677461655562";

const guildID = '680154842316275834';

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
}

client.updateCommands = new Discord.Collection();

const updateCommandFiles = fs.readdirSync('./commands/update/').filter(file => file.endsWith('.js'));
for (const file of updateCommandFiles) {
    const updateCommand = require(`./commands/update/${file}`);
    client.updateCommands.set(updateCommand.name, updateCommand)
}

const getApp = (guildID) => {
    const app = client.api.applications(client.user.id)
    if (guildID) {
        app.guilds(guildID);
    }
    return app;
}

/**
 * 
 * @param {interactions} interaction Interaction Variable
 * @param {String} response This is what will be sent as the command response. 
 */

const reply = async (interaction, response) => {
    let data = {
        content: response
    }

    // Check for embeds
    if (typeof response === 'object') {
        data = await createAPIMessage(interaction, response)
    }

    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data,
        }
    })
}

const createAPIMessage = async (interaction, content) => {
    const {data, files} = await Discord.APIMessage.create(
        client.channels.resolve(interaction.channel_id),
        content
    )
    .resolveData()
    .resolveFiles()

    return { ...data, files }
}

client.once('ready', async (message) => {
    console.log("The bot is online :D Please don't turn me off unless you're debugging or restarting me.");
    //discord_terminal("I was just turned on! Hello world of Discord!", 1, message)

    // Slash Command Thingys //
    const commands = await getApp(guildID).commands.get()
    //console.log(commands)

    // Main Slashcommands //
    await getApp(guildID).commands.post({
        data: {
            name: "ping",
            description: "A hello command."
        }
    })

    await getApp(guildID).commands.post({
        data: {
            name: 'embed',
            description: 'A simple Embeded text',
            options: [
                {
                    name: 'name',
                    description: 'Your name',
                    required: true,
                    type: 3 // Represents a String //
                },
                {
                    name: 'age',
                    description: 'you age',
                    required: true,
                    type: 4 // Integer //

                }
            ]
        }
    })

    client.ws.on('INTERACTION_CREATE', async (interaction) => {
        const { name, options } = interaction.data;
        const commands = name.toLowerCase();

        console.log(options);

        const args = {};

        if (options) {
            for (const option of options) {
                const {name, value} = option
                args[name] = value
            }
        }

        console.log(args)

        if (commands === 'ping') {
            reply(interaction, `I see you're using a slash command. There'll be more coming soon! (Hold your horses bukaroo!)`)
        } else if (commands === 'embed') {
            const embed = new Discord.MessageEmbed()
                .setTitle("Example of an embed")
                .setColor("FF5733")

            for (const arg in args) {
                const value = args[arg]
                embed.addField(arg, value)
            }

            reply(interaction, embed)
        }
    })
});

client.on('ready', () => {
    client.user.setPresence({
        status: 'online',
        activity: {
            name: "!!help | Nymo's Cavern",
            type: 'LISTENING',
        }
    })
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    console.log("Something happend!")

    let hadBoosterRole = oldMember.roles.cache.find(role => role.id === '856885463096098857');
    let hasBoosterRole = newMember.roles.cache.find(role => role.id === '856885463096098857');

    if (!hadBoosterRole && hasBoosterRole) {
        client.channels.cache.get("697426937047678997").send(`Thank you SOOO much <@${newMember.id}> for boosting the server!`);
    } 
});

client.on('guildMemberAdd', (member) => {
    let memberCountFilename = './data/json/members.json';
    let memberCountFile = require('./data/json/members.json');

    if (member.id in memberCountFile.list) member.roles.add(DefaultMembers).catch();

    JSONwrite(memberCountFilename);
})

client.on('message', async (message) => {
    if (!message.content.startsWith(prefix)) {
        if (message.author.bot) {
            if (message.channel.id === "685036523317625048" || message.channel.id === "696010902196977784") {
                message.delete({timeout: 1})
                return;
            } else {
                return;
            }
        } else if (message.channel.type === 'dm') {
            message.channel.send("Sorry! You can't DM me!")
        } else if (message.content.split(" ").includes('@everyone') == true) {
            message.delete({timeout: 1});
        } else if (message.mentions.members.first() === client.user.id) {
            message.channel.send("Did somebody call for me?")
        } else if (message.channel.id === "685036523317625048"){
            if (!message.member.roles.cache.has(AdminRole || AdminPerm || ModsRoles)) {
                if (message.content === "accept" || message.content === "Accept") {
                    if (!message.member.roles.cache.has(DefaultMembers)) {
                        authorsend("Welcome to **Nymo's Community**, " + message.author.username + "!", message);
                        message.member.roles.add("680397965285654551");
                        message.delete({timeout: 1})
                        client.channels.cache.get("697426937047678997").send(`Please welcome <@${message.author.id}> to the server!`);

                        let memberCountFilename = './data/json/members.json'
                        let memberCountFile = require('./data/json/members.json')

                        memberCountFile.list.push(message.author.id)

                        console.log(memberCountFile.list);

                        JSONwrite(memberCountFilename)
                        return;
                    } else message.delete({timeout: 1})
                } else message.delete({timeout: 1});
            }
        } else if (message.mentions.members.first() == client.user.id) {
            message.channel.send("Did you call for me?");
        } else if (message.channel.id === "696010902196977784") {
            if (message.content == "Gamer" || message.content == "gamer") {
                if(!message.member.roles.cache.has("850008425046999101")) {
                    message.member.roles.add("850008425046999101")
                    message.author.send("You have been given the **Gamer** role!").catch();
                } else if (message.member.roles.cache.has("850008425046999101")) {
                    message.member.roles.remove("850008425046999101");
                    message.author.send("The **Gamer** role has been removed!").catch();
                }
            } else if (message.content == "Helper" || message.content == "helper") {
                if(!message.member.roles.cache.has("850029942539419708")) {
                    message.member.roles.add("850029942539419708")
                    message.author.send("Why did you chose the **Helper** role?").catch();
                } else if (message.member.roles.cache.has("850029942539419708")) {
                    message.member.roles.remove("850029942539419708");
                    message.author.send("Thank god you removed your **Helper** role.", 1).catch();
                }
            } else if (message.content == "Artist" || message.content == "artist") {
                if(!message.member.roles.cache.has("850032711908720670")) {
                    message.member.roles.add("850032711908720670")
                    message.author.send("You have been given the **Artist** role!").catch();
                } else if (message.member.roles.cache.has("850032711908720670")) {
                    message.member.roles.remove("850032711908720670");
                    message.author.send("The **Artist** role has been removed!").catch();
                }
            } else if (message.content == "Programmer" || message.content == "programmer") {
                if(!message.member.roles.cache.has("850033986481946724")) {
                    message.member.roles.add("850033986481946724")
                    message.author.send("You have been given the **Programmer** role!").catch();
                } else if (message.member.roles.cache.has("850033986481946724")) {
                    message.member.roles.remove("850033986481946724");
                    message.author.send("The **Programmer** role has been removed!").catch();
                }
            } else {
                message.author.send("\"" + message.content + "\" is an unknown role! Please check you spelt it right!").catch();
            }
        }
    }

    const args = message.content.slice(prefix.length).trim().split(" ");
    const command = args.shift().toLowerCase();

    console.log(`${message.author.tag} said "${message.content}"`)

    let splitCommand = message.content.split(" ");

    if (message.channel.id != "685036523317625048" && message.channel.id != "696010902196977784" && message.channel.type != 'dm' && message.content.startsWith(prefix)) {
        if (message.content.split(" ").includes('@everyone') == true) {
            return;
        } else if (command == 'ping') {
            client.commands.get('ping').execute(message, client);
        } else if (command == 'abt' || command == 'about'){
            not_done_yet(message, command);
        } else if (command == 'role') {
            client.commands.get('role').execute(message, AdminPerm, AdminRole, StaffRole, ModsRoles, AdvancedRole);
        } else if (command == "r" || command == "report") {
            client.commands.get('report').execute(message, client, punishChannel, Discord);
        } else if (command == "update") {

            if (args[0] == null) {
                message.channel.send("Please add the modifier to what you'd want to update.")
            } else if (args[0] == "nick" || args[0] == "nickname") {
                if (message.member.roles.cache.has(AdminRole) || message.member.roles.cache.has(AdminPerm) || message.member.roles.cache.has(ModsRoles) || message.member.roles.cache.has(StaffRole)) {
                    client.updateCommands.get('nickname').execute(message, args, AdminPerm, AdminRole, StaffRole, ModsRoles)
                }
            } else {
                message.channel.send("Sorry but that isn't one of the the applicable modifiers.")
            }

        } else if (command == "invite") {
            message.channel.send("Here's the link for the server! https://discord.gg/EudUY68.")
        } else if (command == "a") {
            message.channel.send("This isn't a real command, fool.")
        } else if (command == "kick") {

            client.commands.get('kick').execute(message, args, client, AdminPerm, AdminRole, StaffRole, ModsRoles);

        } else if (command == 'botconfig') {
            client.commands.get('botconfig').execute(message, client, Discord);
        } else if (command == 'admin') {
            message.channel.send("Try harder.")
        } else if (command == 'help') {
            let helpEmbed = new Discord.MessageEmbed()
            .setTitle("Bot Help Panel")
            .addField(
                "Commands:",
                "```\n" +
                "Ping      | Basic Ping Command.\n" +
                "Role      | Giving Role, must have staff or higher.\n" +
                "Report    | Reporting a member.\n" +
                "Event     | Must have Content Creator or higher, creates an event\n" +
                "Update    | (Still in dev) Can updates a user's username, for now.\n" +
                "Invite    | Gives you the invite link for the server.\n" + 
                "a         | This is not a real command, fool.\n" +
                "Kick      | Kicks a member. Must have staff or higher.\n" +
                "Botconfig | Gives you the bot configuration.\n" + 
                "Help      | This command.```\n\n" +
                "These were ordered in the order they are in the code."
            )

            authorsend(helpEmbed, message);

            message.channel.send("You have recieved mail!") 
        }
    } else if (message.channel.type === 'dm' && message.content.startsWith(prefix)) {
        message.channel.send("Sorry! You can't DM me!")
    } else if (message.content.startsWith(prefix) && message.channel.id == "685036523317625048" || message.channel.id == "696010902196977784") {
        message.delete({timeout: 1});
    }
});

/**
 * 
 * @param {String} send 
 * @param {Discord} message 
 */

function authorsend(send, message) {message.author.send(send).catch()} 

function not_done_yet(message, command) {
    let random = Math.floor(Math.random() * 4);

    switch (random) {
        case 0:
            message.channel.send("Are you ready to recive a overdose amount of a *~CRINGE?~* Obviously not.")
            break;
        case 1:
            message.channel.send("I think you misspelled that command it surely can't be \"" + command + "\"")
            break;
        case 2:
            message.channel.send("Lmao look at this. What a typo!")
            break;
    }

    message.channel.send("That's just another way of us saying that we haven't finished this command yet.")
}

function Time() {
    var clock = new Date();
    var hour = clock.getHours();
    var min = clock.getMinutes();
    
    if (hour < 10) {
        hour = "0" + hour;
    }
    else {
        hour = hour;
    }

    if (min < 10) {
        min = "0" + min;
    }
    else {
        min = min;
    }

    return hour + ":" + min;
}

function Day() {
    var clock = new Date();
    var day = clock.getDate()
    var month = clock.getMonth()
    var year = clock.getFullYear()

    return `${day}/${month}/${year}`

}

function Time_Day() {
    return `${Time()} ${Day()}`
}

/**
 * 
 * @param {number} mode This is the type of unique ID generated 1 - 2
 * @returns {String} This is the unique ID to put into any variable of a string.
 */

function createID (mode) {
    switch (mode) {
        case 1:
            return Math.random().toString(36).substr(2, 9);
        case 2:
            return Date.now().toString();
        default:
            return "Unidentified Value: Could not create ID due to unkown \"case\""
    }
}

/**
 * 
 * @param {File} filename This is the JSON file that will be edited.
 */

function JSONwrite(filename) {
    fs.writeFile(filename, JSON.stringify(require(filename), null, 2), (err) => {if (err) return console.log(err)});
}

client.login(ConfigData.TOKEN)