module.exports = {
    name: "dice",
    description: "Rolls a dice from 1 - 6",
    execute(client, message, args, MessageEmbed) {
        let diceEmbed = new MessageEmbed()
        .setTitle(`Rolling... Rolled a ${Math.floor(Math.random() * 7)}`)
        .setColor("GREEN")
        message.channel.send({ embeds: [diceEmbed] })
    }
};