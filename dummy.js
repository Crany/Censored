const Discord = require('discord.js');

const client = new Discord.Client();

const prefix = '<'

const fs = require('fs');

client.commands = new Discord.Collection();

const commandfiles = fs.readdirSync('./commands/').filter(File => File.endsWith('.js'));
for(const file of commandfiles){
    const command = require(`./commands/${file}`)

    client.commands.set(command.name, command)
}
client.once('ready', () => {
    console.log('Lusion is online!');
});

client.on('message', message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/) 
    const command = args.shift().toLowerCase();

    if(command === 'ping'){
     client.command.get('ping').execute(message, args);
    }else if (command == 'youtube'){


     message.channel.send('https://www.youtube.com/TeamLusion%27')


     }
});