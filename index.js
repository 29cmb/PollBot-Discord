const Discord = require('discord.js');
const bot = Discord.Client();
const PREFIX = `+` 
const fs = require('fs');

const activities_list = [
  `+usage`,
  `+help`
]; // creates an arraylist containing phrases you want your bot to switch through.


bot.on('ready', () => {
  console.log('Poll Bot Online')

  setInterval(() => {
    const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
    bot.user.setActivity(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.
  }, 5000); // Runs this every 5 seconds.


});




bot.on(`message`, message => {
  let args = message.content.substring(PREFIX.length).split(" ")

  switch (args[0]) {

    case `poll`:
        let pollrole = message.guild.roles.cache.find(r => r.name == 'Poll Perms')
        let msgArgs = args.slice(1).join(" ");
        var PollEmbed = new Discord.MessageEmbed()
          .setTitle('POLL:')
          .setDescription(msgArgs)
          .setColor('RANDOM')
          .addField('Poll Author', `<@${message.author.id}>`, true)
          .setTimestamp()
        try {
          if (message.member.roles.cache.has(pollrole.id)) {
            if (msgArgs) {
              message.channel.send(PollEmbed).then(messageReaction => {
                messageReaction.react('👍');
                messageReaction.react('👎');
              })
            } else {
              message.channel.send('You need to state a poll name')
            }
          } else {
            message.channel.send('You do not have the `Poll Perms`role\n**The bot might be setting the role up right now, when the bot does, if you have manage roles, give it to yourself to use poll commands.**')
          }
        } catch (e) {
          console.log(`${e}, The error was in the guild ${message.guild.name}`)
          message.channel.send(`There was a error, try doing the following\n\n**1. If the \`Poll Perms\` Role does not exist, Please create it**\n**2. Make sure the bot has the permission \`Embed Links\` and \`Attach Files\`**\n\nIf none of these work, join our server **https://discord.gg/2fdPuaFf4s** and then put this message in the bugs channel\n\n\`${e}\``)
        }
      }
      break

  }
})



bot.on('message', message => {
  if (message.guild.roles.cache.some(r => r.name == 'Poll Perms')) {
    return;
  }

  message.guild.roles.create({
    data: {
      name: 'Poll Perms',
      color: '#217592'
    }
  })

  message.channel.send('Hello, Thank you for using poll bot, please wait why we set things up\n**This Proccess can take up to 20 secconds**\nThanks you your paitence').then(edit => {
    edit.edit(`All set up! The poll role is \`Poll Perms\``)


  })

})


bot.on('message', message => {
  if (message.content == PREFIX + 'usage') {
     message.channel.send('Usage: +poll <poll name>\nAs you are reading this, the bot should be generating the required role, if it has not been created already.')
  }
})

bot.on(`message`, message => {
  if (message.content == PREFIX + 'help') {
    var Embed = new Discord.MessageEmbed()
      .setTitle(`Command List`)
      .setDescription(`+usage  -  Views the bot's poll usage\n+giveaway <time> #channel <prize>  -  Creates a giveaway\n+card - Views the bots status card`)
    message.channel.send(Embed)
  }
})


bot.on('message', message => {
  if (message.content == PREFIX + `card`) {
      var cardEmbed = new Discord.MessageEmbed()
        .setTitle(`Bot status card`)
        .setDescription(`Official Status card`)
        .addField(`${bot.guilds.cache.size} guilds`, 'Guild counter', true)
        .addField(`${bot.channels.cache.size} channels`, 'Global Channel Counter', true)
        .addField(`Developers`, `[Cmb#2369](dsc.bio/29cmb)`)
        .setColor('RANDOM')
      message.channel.send(cardEmbed)
  }
})



bot.on('guildCreate', guild => {
  console.log(`New guild, ${guild.name}`)
})




require('dotenv').config()

bot.config = require('./giveaway-settings.json')

const { GiveawaysManager } = require('discord-giveaways');
bot.giveawaysManager = new GiveawaysManager(bot, {
    storage: "./giveaways.json",
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        embedColor: "RANDOM",
        reaction: "🎉"
    }
});

bot.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} entered giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});

bot.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} unreact to giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});



bot.commands = new Discord.Collection();

/* Load all commands */
fs.readdir("./commands/", (_err, files) => {
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        bot.commands.set(commandName, props);
        console.log(`👌 Command loaded: ${commandName}`);
    });
});

bot.on('message', message => {
   // Ignore all bots
    if (message.author.bot) return;
  
    // Ignore messages not starting with the prefix (in config.json)
    if (message.content.indexOf(PREFIX) !== 0) return;
  
    // Our standard argument/command name definition.
    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
    // Grab the command data from the client.commands Enmap
    const cmd = bot.commands.get(command);
  
    // If that command doesn't exist, silently exit and do nothing
    if (!cmd) return;
  
    // Run the command
    cmd.run(client, message, args);
})



bot.login(process.env.BOT_TOKEN)
