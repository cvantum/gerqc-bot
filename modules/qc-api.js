"use strict";

exports.QcAPICommands = class QcAPICommands {
    constructor(config) {
        this.config = config;
    }

    getUserCommands() {
        return {
            "gdpr" : {
                desc: "Bitte Datenschutzerklärung lesen und akzeptieren mit **?gdpr accept**",
                process: function (bot,msg,values) {
                    let response = [];
                    msg.channel.send(response.join('\n'));
                    console.log('gdpr abfrage by: ' + msg.author.username );
                }
            },
            "register" : {
                dsec: "Speicher Quake Champions Nutzer für dein Discord-Konto",
                process: function (bot,msg,values) {
                    let response = [];
                    msg.channel.send(response.join('\n'));
                    console.log('register aufruf by: ' + msg.author.username );
                }

            }
        };
    }
};