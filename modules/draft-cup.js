"use strict";

exports.DraftCommands = class DraftCommands {
    constructor(config) {
        this.config = config;
    }

    getUserCommands() {
        return {
            "draft" : {
                desc: "Draft-Cup start | stop | clear",
                process: function (bot,msg,values) {
                    let response = [];
                    msg.channel.send(response.join('\n'));
                    console.log('draft aufruf by: ' + msg.author.username );
                }
            },
            "signup" : {
                dsec: "Anmelden am Draft-Cup",
                process: function (bot,msg,values) {
                    let response = [];
                    msg.channel.send(response.join('\n'));
                    console.log('signup by: ' + msg.author.username );
                }
            },
            "signout" : {
                dsec: "Abmelden am Draft-Cup",
                process: function (bot,msg,values) {
                    let response = [];
                    msg.channel.send(response.join('\n'));
                    console.log('signout by: ' + msg.author.username );
                }
            }
        };
    }
};