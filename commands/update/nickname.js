module.exports = {
    name: "nickname",
    execute(message, args, AdminPerm, AdminRole, StaffRole, ModsRoles) {
        let member = message.mentions.members.first()

        let newargs = args.slice(2).join(" ");

        if (member != null) {
            if (member.user.bot != true) {
                if (newargs == (null || "")) {
                    if (member == null) {
                        if (message.member.roles.cache.has(AdminRole || AdminPerm)) {
                            message.channel.send("Sorry, I'm not allowed to complete this action.");
                        } else if (message.member.roles.cache.has(ModsRoles)) {
                            message.member.setNickname("[Mod] " + message.member.user.username)
                        } else if (message.member.roles.cache.has(StaffRole)) {
                            message.member.setNickname("[Staff] " + message.member.user.username)
                        } else if (message.member.roles.cache.has(AdancedRole)) {
                            message.member.setNickname("[Advanced] " + message.member.user.username)
                        } else {
                            message.member.setNickname(member.user.username)
                        }
                    } else if (member != null) {
                        if (member.roles.cache.has(AdminRole || AdminPerm)) {
                            message.channel.send("Sorry, I'm not allowed to complete this action.")
                        } else if (member.roles.cache.has(ModsRoles)) {
                            member.setNickname("[Mod] " + member.user.username)
                        } else if (member.roles.cache.has(StaffRole)) {
                            member.setNickname("[Staff] " + member.user.username)
                        } else if (member.roles.cache.has(AdancedRole)) {
                            member.setNickname("[Advanced] " + member.user.username)
                        } else {
                            member.setNickname(member.user.tag)
                        }
                    }
                } else if (newargs != "") {

                    if (member == null) {
                        if (message.member.roles.cache.has(AdminRole || AdminPerm)) {
                            message.channel.send("Sorry, I'm not allowed to complete this action.");
                        } else if (message.member.roles.cache.has(ModsRoles)) {
                            message.member.setNickname("[Mod] " + newargs)
                        } else if (message.member.roles.cache.has(StaffRole)) {
                            message.member.setNickname("[Staff] " + newargs)
                        } else if (message.member.roles.cache.has(AdancedRole)) {
                            message.member.setNickname("[Advanced] " + newargs)
                        } else {
                            message.member.setNickname(newargs)
                        }
                    } else if (member != null) {
                        if (member.roles.cache.has(AdminRole || AdminPerm)) {
                            message.channel.send("Sorry, I'm not allowed to complete this action.")
                        } else if (member.roles.cache.has(ModsRoles)) {
                            member.setNickname("[Mod] " + newargs)
                        } else if (member.roles.cache.has(StaffRole)) {
                            member.setNickname("[Staff] " + newargs)
                        } else if (member.roles.cache.has(AdancedRole)) {
                            member.setNickname("[Advanced] " + newargs)
                        } else {
                            member.setNickname(newargs)
                        }
                    }
                }
            } else {
                message.channel.send(`Sorry ${message.author}, you can't do that since they're a bot!`)
            }
        }
        
    }
}