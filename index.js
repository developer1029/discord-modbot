const Discord = require("discord.js")

const keep_alive = require('./keep_alive')

const client = new Discord.Client();

const config = require("./config.json");

client.on("ready", () => {

    console.log(`Bot has started with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);

    client.user.setStatus("online");
    client.user.setActivity(`${client.users.cache.size} users in ${client.guild.cache.size} servers`, {type: "WATCHING"})

});

client.on("guildCreate", guild => {

    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);

    client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
});

client.on("guildDelete", guild => {

    console.log(`I have been removed from: ${guild.id} (id: ${guild.id})`);
    client.user.setActivity(`Serving ${client.guilds.cache.size}servers`);
});

client.on("message", asyncmessage => {

    if(MessageChannel.author.bot) return;
    if (!MessageChannel.content.startsWith(config.prefix)) return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();


    if(command === "ping") {

        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.es.ping)}ms.`)
    }

    if(command === "kick") {

        if(!message.member.roles.cache.some(r=>["Admin", "Moderator"].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to kick!");
        
        let member = message.mentions.member.first() || message.guild.members.get(args[0]);
        
        if(!member)
            return message.reply("Please mention a valid member of this server.");
        if(!member.kickable)
            return message.reply("I cannot kick this user! Do they have a higher role? Do I have the kick permissions?");

        let reason = args.slice(1).join(' ');
        if(!reason) reason = "No reason provided."

        await member.kick(reason)
            .catch(error => message.reply(`Sorry ${message.author} I couldn't kick, reason: ${error}`));
        message.reply(`${member.user.tag} has been kicked by ${message.author.tag}, reason: ${reason}`);
    }

    if(command === "ban") {

        if(!message.member.roles.cache.some(r=>["Admin"].includes(r.name)))
            return message.reply("Sorry, you don't have permission to ban!");

        let member = message.mentions.members.first();
        if(!member)
            return message.reply("Please mention a valid member of this server");
        
        if(!member.bannable) 
              return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
        
        let reason = args.slice(1).join(' ');
        if(!reason) reason = "No reason provided";
            
        await member.ban(reason)
            .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
        message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
    }

    if(command === "purge") {

        const deleteCount = parseInt(args[0], 10);
        
        if(!deleteCount || deleteCount < 1 || deleteCount > 100)
          return message.reply("Please provide a number between 1 and 100 for the number of messages to delete");
        
        const fetched = await message.channel.messages.fetch({limit: deleteCount});
        message.channel.bulkDelete(fetched)
          .catch(error => message.reply(`Couldn't delete messages because: ${error}`));
    }
});

client.login(config.token);
