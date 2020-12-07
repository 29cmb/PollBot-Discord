const Discord = require('discord.js');
const bot = new Discord.Client();
const PREFIX = '+';
const activities_list = [
  '+usage',
  '+usage'
  ]; // creates an arraylist containing phrases you want your bot to switch through.

bot.on('ready', () => {
  console.log('Poll Bot Online')

  setInterval(() => {
      const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
      bot.user.setActivity(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.
  }, 5000); // Runs this every 5 seconds.
  
});



//poll command
bot.on('message', message => {
  let args = message.content.substring(PREFIX.length).split(" ");
    switch (args[0]){

      case 'poll':
        
      let msgArgs = args.slice(1).join(" ");


      var PollEmbed = new Discord.MessageEmbed()
      .setTitle('POLL:')
      .setDescription(msgArgs)
      .setColor('RANDOM')
      .addField('Poll Author', `<@${message.author.id}>`, true)
      .setTimestamp()
      let role = message.guild.roles.cache.find(role => role.name == 'Poll Perms')
      if (message.member.roles.cache.has(role)) {
        if(msgArgs) {
           message.channel.send(PollEmbed).then(messageReaction => {
          messageReaction.react('👍');
          messageReaction.react('👎');
          
          console.log('Poll Command Executed')
          });
       } else {
         message.channel.send('You need to state a name of the poll!')
       }              
      
      break;

      }
    }

})

bot.on('message', message => {
  let args = message.content.substring(PREFIX.length).split(" ");

  switch (args[0]){

    case 'usage':
      message.channel.send('Usage: +poll <poll name>\n As you are reading this, the bot should be generating the required role, if it has not been created already.')
    break;

  }

})


bot.on('message', message => {
  if(message.author.bot){
    return
  } 
    if(message.guild.roles.cache.find(r => r.name == 'Poll Perms')){
      return 
    }

    
    message.guild.roles.create({
        data:{
          name: 'Poll Perms',
          color: 'RANDOM'
        }
      })
    message.channel.send('Hello, Thank you for using poll bot, please wait why we set things up\n **This Proccess can take up to 20 secconds**\n Thanks you your paitence')

})

require('dotenv').config()

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
// We now have a client.giveawaysManager property to manage our giveaways!

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
