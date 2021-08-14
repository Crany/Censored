module.exports = {
    name: "role",
    execute(message, AdminPerm, AdminRole, StaffRole, ModsRoles, AdvancedRole) {
        if (message.member.roles.cache.has("680397530676068365") || message.member.roles.cache.has("680180666549141588")){
            let role   = message.mentions.roles.first()
            let member = message.mentions.members.first();

            try {
                if (member != null && role != null) {
                    if (role.id == (AdminPerm || AdminRole) || member.roles.cache.has(AdminRole || AdminPerm)) { 
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
                                        member.send(`${message.author.tag} just gave you the **MODERATORS** Role!`).catch()
                                    } else if (member.roles.cache.has(ModsRoles)) {
                                        member.roles.remove(ModsRoles)
                                        member.send(`${message.author.tag} just removed your **MODERATORS** Role!`).catch()
                                    }
                                } else if (!member.roles.cache.has(ModsRoles)) {
                                    member.roles.add(ModsRoles);
                                    member.send(`${message.author.tag} just gave you the **MODERATORS** Role!`).catch()
                                }
                            } else {
                                authorsend("Sorry! You have to be a Moderator or higher to have this role!", message)
                            }
                        } else {
                            if (member.id == message.author.id) {
                                if (!member.roles.cache.has(role.id)) {
                                    member.roles.add(role.id)
                                } else if (member.roles.cache.has(role.id)) {
                                    member.roles.remove(role.id)
                                }
                            } else if (member.id != message.author.id) {
                                if (!member.roles.cache.has(role.id)) {
                                    member.roles.add(role.id)
                                    member.send(message.author.tag + " just gave you the " + role.name + " role!").catch()
                                } else if (member.roles.cache.has(role.id)) {
                                    member.roles.remove(role.id)
                                    member.send(message.author.tag + " just removed your " + role.name + " role!").catch()
                                }
                            }
                        }


                        if (member.user.bot != true) {
                            if (role.id == ModsRoles) {
                                if (!member.roles.cache.has(ModsRoles)) member.setNickname("[Mod] " + member.user.username)
                                else if (member.roles.cache.has(ModsRoles)) member.setNickname("[Staff] " + member.user.username);
                            } else if (role.id == StaffRole) {
                                if (!member.roles.cache.has(StaffRole)) member.setNickname("[Staff] " + member.user.username)
                                else if (member.roles.cache.has(StaffRole)) member.setNickname("[Advanced] " + member.user.username);
                            } else if (role.id == AdvancedRole) {
                                if (!member.roles.cache.has(AdvancedRole)) member.setNickname("[Advanced] " + member.user.username)
                                else if (member.roles.cache.has(AdvancedRole)) member.setNickname(member.user.username);
                            }
                        }
                        
                        
                    }
                } else if (member == null || role == null) {
                    message.delete({timeout: 1})
                    message.author.send("Please specify both the **TAG** and the **ROLE** you'd like to asign/remove from the person.").catch()
                }
            } catch (err) {
                message.author.send("Sorry! **There was an error doing that!** Try again.\nIf you were doing it to a admin, that was sadly disabled.").catch();
                console.log(err)
            }

        } else {
            message.author.send("Sorry but you don't meet the requirements to do that action!").catch();
        }
    }
}

function authorsend(send, message) {message.author.send(send).catch()}