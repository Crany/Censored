module.exports = {
    name: "kick",
    description: "Allows Advanced People and higher to kick people",
    execute(message, args) {
        if(message.member.roles.cache.has('680397530676068365')) {
            message.channel.send("You can't do that yet!")
        } else {
            message.channel.send("You can't do that!")
        }
    }
}