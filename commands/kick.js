module.exports = {
    name: 'kick',
    usage: '[User] [reason]',
    description: 'Kick a user from this guild',
    category: 'punishing',
    async execute(msg, args, client, Discord) {
        const permissions = msg.channel.permissionsFor(msg.client.user);
        if (!permissions.has('KICK_MEMBERS')) return msg.channel.send('Missing permission: kick members!');
        if (!msg.member.hasPermission("KICK_MEMBERS", true, true)) return msg.channel.send(client.global.replies.notAllowed);
        if (!args[1]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0], client);
        const member = client.funcs.fetchMember(args[0], msg);
        if (!member) return msg.channel.send(client.global.replies.noMember);
        if (member.user.id === client.user.id) return msg.channel.send('I can\'t kick myself!');
        if (member.hasPermission('KICK_MEMBERS')) return msg.channel.send('I can\'t kick them!');
        let reason = args.slice(1).join(' ');
        const d = client.global.db.guilds[msg.guild.id];
        if (d.channels.punishments) {
            const embed = new Discord.RichEmbed()
                .setTitle('**- Kick -**')
                .addField('Kicked User', member)
                .addField('Kicked By', msg.member)
                .addField('Kicked For', reason)
                .setColor('#ff0000')
            await msg.guild.channels.get(d.channels.punishments).send(embed);
        }
        await msg.guild.member(member.user).kick(reason);
        msg.channel.send(`Successfully kicked **${member.displayName}**.`);
    },
};
