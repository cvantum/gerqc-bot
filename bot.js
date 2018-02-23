"use strict";

const fs = require("fs");
const Discord = require("discord.js");

const configFile = process.env.PWD+'/config/config.json';
const Core = require(process.env.PWD+'/modules/core.js');
const Challonge = require(process.env.PWD+'/modules/challonge.js');
const QCAPI = require(process.env.PWD+'/modules/qc-api.js');


try {
    fs.accessSync(configFile, fs.F_OK);
    var config = require(configFile);
} catch (error) {
    console.error('Could not find File: '+configFile);
    process.exit(1);
}

//////////////////////////////////////
// Starting instances from every module
const core = new Core.CoreCommands(config);
const challonge = new Challonge.ChallongeCommands(config);
const qcapi = new QCAPI.QcAPICommands(config);



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
        let values = [];
        let response_message = [];
        if (userCommands.hasOwnProperty(command)) {
            console.log("Emitted user-command");
            userCommands[command].process(mybot,message,values);
        }
        message.channel.send(response_message.join('\n'));
    }
});

//mybot.on('guildMemberAdd', member => {
mybot.on('guildMemberAvailable', (member) => {
    console.log(member.user);
});

//////////////////////////////////////
// Get List of User-Commands for loaded modules
function getUserCommands() {
    let commands = {};
    let coreCommands = core.getUserCommands();
    for (let coreCmd in coreCommands) {
        commands[coreCmd] = coreCommands[coreCmd];
    }

    let challongeCommands = challonge.getUserCommands();
    for (let challongeCmd in challongeCommands) {
        commands[challongeCmd] = challongeCommands[challongeCmd];
    }

    let qcapiCommands = qcapi.getUserCommands();
    for (let qcCmd in qcapiCommands) {
        commands[qcCmd] = qcapiCommands[qcCmd];
    }
    return commands;
}

let userCommands = getUserCommands();
console.log(userCommands);