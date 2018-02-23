"use strict";

const fs = require("fs");
const Discord = require("discord.js");

const configFile = process.env.PWD+'/config/config.json';


try {
	fs.accessSync(configFile, fs.F_OK);
	var config = require(configFile);
} catch (error) {
	console.error('Could not find File: '+configFile);
	process.exit(1);
}

const mybot = new Discord.Client();
mybot.login(config.discord_token);

//////////////////////////////////////
// Emitted event on 'ready'
mybot.on('ready', () => {
    let statusMessage = [];
    let serverArray = [];
    console.log('Ready to begin! Serving on ' + mybot.guilds.size + ' servers');
    statusMessage.push('Bot was started');
    statusMessage.push('Command-Prefix: '+config.discord_prefix);
    statusMessage.push('Working on '+mybot.guilds.size+' servers');
    for (let server in mybot.guilds.array() ) {
        statusMessage.push("**Name:  **"+mybot.guilds.array()[server].name);
        statusMessage.push("Owner: "+mybot.guilds.array()[server].owner.user.username+'#'+mybot.guilds.array()[server].owner.user.discriminator);
        serverArray.push({
            'server_id': mybot.guilds.array()[server].id,
            'server_name': mybot.guilds.array()[server].name,
            'owner_id': mybot.guilds.array()[server].ownerID,
            'admins': [mybot.guilds.array()[server].ownerID]});
    }
    mybot.user.setActivity('type ?help');
    console.log(statusMessage);
});

mybot.on('message', (message) => {
    if (!message.author.bot && message.content.startsWith(config.discord_prefix)) {
        let command = message.content.split(" ")[0].substring(1);
        let response_message = [];
        switch (command) {
            case 'cointoss':
                let cointoss = Math.floor(Math.random() * 2);
                console.log(cointoss);
                if (cointoss === 0) {
                    response_message.push('Kopf');
                } else {
                    response_message.push('Zahl');
                }
                break;
            default:
                //
        }
        message.channel.send(response_message.join('\n'));
    } else if (message.content === 'ping') {
        console.log(message.author);
        console.log(message.channel.type);
        console.log(message.member.roles.get('409393569833549827'));
        message.reply('pong');
    }
});

//mybot.on('guildMemberAdd', member => {
mybot.on('guildMemberAvailable', (member) => {
    console.log(member.user);
});

