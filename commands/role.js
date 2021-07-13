const Discord = require('discord.js');
const client  = new Discord.Client();

const AdminRole = "680397530676068365";
const StaffRole = "680180666549141588";
const ModsRoles = "856834038815916052";
const AdminPerm = "860431100337324062";
const compeople = "680397965285654551";
const AdancedRole = "696001274423803994";
const punishChannel = "857336677461655562";

function authorsend(send, message) {message.author.send(send).catch(() => discord_terminal(`Error: Could not send a DM to <@${message.author.id}>.`, 1, message, null))} 

function discord_terminal(write, mode, message) {
    client.channels.cache.get("863851605891743754").send(write)
}

module.exports = {
    name: 'role',
    description: 'this role command gives and takes away roles from people',
    async execute (message, args) {
        if (message.member.roles.cache.has("680397530676068365") || message.member.roles.cache.has("680180666549141588")){
            let role   = message.mentions.roles.first()
            let member = message.mentions.members.first();

            try {
                if (member != null && role != null) {
                    if (role.id == AdminPerm || role.id == AdminRole || member.roles.cache.has(AdminRole) || member.roles.cache.has(AdminPerm)) { 
                        authorsend(`Sorry! I can't do that! The **${role.name.toUpperCase()}** role has to be given manually.`, message)
                    } else {
                        if (role.id == ModsRoles) {
                            if (message.member.roles.cache.has(ModsRoles || AdminPerm || AdminRole)) {
                                if (member.roles.cache.has(ModsRoles && !AdminPerm || !AdminRole)) {
                                    authorsend("Sorry! I can't do that! If you think they are abusing their role, report it to and admin.", message)
                                    return
                                } else if (message.member.roles.cache.has(AdminRole || AdminPerm)) {
                                    if (!member.roles.cache.has(ModsRoles)) {
                                        member.roles.add(ModsRoles);
                                        discord_terminal(`<@${message.author.id}> just gave ${member} the <@&${ModsRoles}> role!`)
                                        member.send(`${message.author.tag} just gave you the **MODERATORS** Role!`).catch(() => discord_terminal(`Error: Could not send a DM to ${member}.`, 1, message))
                                    } else if (member.roles.cache.has(ModsRoles)) {
                                        member.roles.remove(ModsRoles)
                                        discord_terminal(`<@${message.author.id}> just gave ${member} the <@&${ModsRoles}> role!`)
                                        member.send(`${message.author.tag} just removed your **MODERATORS** Role!`).catch(() => discord_terminal(`Error: Could not send a DM to <@${member}.`, 1, message))
                                    }
                                } else if (!member.roles.cache.has(ModsRoles)) {
                                    member.roles.add(ModsRoles);
                                    member.send(`${message.author.tag} just gave you the **MODERATORS** Role!`).catch(() => discord_terminal(`Error: Could not send a DM to ${member}.`, 1, message))
                                }
                            } else {
                                authorsend("Sorry! You have to be a Moderator or higher to have this role!", message)
                            }
                        } else {
                            if (member.id == message.author.id) {
                                if (!member.roles.cache.has(role.id)) {
                                    member.roles.add(role.id)
                                    discord_terminal(`${member} just gave themselfs the <@&${role.id}> role!`, 1, message, null)
                                } else if (member.roles.cache.has(role.id)) {
                                    member.roles.remove(role.id)
                                    discord_terminal(`${member} just removed their <@&${role.id}> role!`, 1, message, null)
                                }
                            } else if (member.id != message.author.id) {
                                if (!member.roles.cache.has(role.id)) {
                                    member.roles.add(role.id)
                                    discord_terminal(`<@${message.author.id}> just gave ${member} the <@&${role.id}> role!`, 1, message, null)
                                    member.send(message.author.tag + " just gave you the " + role.name + " role!").catch(() => discord_terminal(`Error: Could not send a DM to ${member}.`, 1, message))
                                } else if (member.roles.cache.has(role.id)) {
                                    member.roles.remove(role.id)
                                    discord_terminal(`<@${message.author.id}> just removed ${member}'s <@&${role.id}> role!`, 1, message, null)
                                    member.send(message.author.tag + " just removed your " + role.name + " role!").catch(() => discord_terminal(`Error: Could not send a DM to ${member}.`, 1, message))
                                }
                            }
                        }
                        
                        if (role.id == ModsRoles) {
                            if (!member.roles.cache.has(ModsRoles)) member.setNickname("[Mod] " + member.user.username)
                            else if (member.roles.cache.has(ModsRoles)) member.setNickname("[Staff] " + member.user.username);
                        } else if (role.id == StaffRole) {
                            if (!member.roles.cache.has(StaffRole)) member.setNickname("[Staff] " + member.user.username)
                            else if (member.roles.cache.has(StaffRole)) member.setNickname("[Advanced] " + member.user.username);
                        } else if (role.id == AdancedRole) {
                            if (!member.roles.cache.has(AdancedRole)) member.setNickname("[Advanced] " + member.user.username)
                            else if (member.roles.cache.has(AdancedRole)) member.setNickname(member.user.username);
                        }
                    }
                } else if (member == null || role == null) {
                    message.delete({timeout: 1})
                    message.author.send("Please specify both the **TAG** and the **ROLE** you'd like to asign/remove from the person.").catch(() => discord_terminal(`Error: Could not send a DM to <@${message.author.id}>.`, 1, message, null))
                }
            } catch (err) {
                message.author.send("Sorry! **There was an error doing that!** Try again.\nIf you were doing it to a admin, that was sadly disabled.").catch(() => discord_terminal(`Error: Could not send a DM to <@${message.author.id}>.`, 1, message, null));
                console.log(err)
            }

        } else {
            message.author.send("Sorry but you don't meet the requirements to do that action!").catch(() => discord_terminal(`Error: Could not send a DM to <@${message.author.id}>.`, 1, message, null));
            discord_terminal("<@" +  message.author.id + "> tried to give somebody a role but didn't meet the requirements.");
        }
    }
}