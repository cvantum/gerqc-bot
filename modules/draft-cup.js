"use strict";

exports.DraftCommands = class DraftCommands {
    constructor(config) {
        let self = this;
        self.config = config;
    }

    getUserCommands() {
        let self = this;
        return {
            "draft" : {
                desc: "Draft-Cup start | stop | clear",
                process: function (bot,msg,values) {
                    let response = [];
                    if (values.length === 0) {
                        console.log(values.length);
                        response.push('Bitte Parameter angeben: `help | start | close | reopen | abort | clear`');
                    } else if ( values[0] === 'help') {
                        response.push('```');
                        response.push('help:   Diese Hilfe');
                        response.push('start:  Starte einen neuen Draft-Cup');
                        response.push('close:  Schließe die Anmeldung');
                        response.push('reopen: Öffne die Anmeldung erneut');
                        response.push('abort:  Abbrechen des Vorgangs');
                        response.push('clear:  Reset der bisherigen Daten');
                        response.push('```');
                    } else if (values[0] === 'start') {
                        let cup = self.getDraftCupMethod();
                        self.cup = cup;
                        response.push('Cup gestartet');
                    }
                    msg.channel.send(response.join('\n'));
                    console.log('draft aufruf by: ' + msg.author.username );
                }
            },
            "signup" : {
                desc: "Anmelden am Draft-Cup",
                process: function (bot,msg,values) {
                    let response = [];
                    console.log(self);
                    if (self.hasOwnProperty('cup')) {
                        response.push(self.getWelcomeMessage().replace('@user', msg.author.username));
                        self.cup.player_list.push(msg.author.id);
                    } else {
                        response.push('Kein Cup gestartet');
                    }
                    msg.channel.send(response.join('\n'));
                    console.log('signup by: ' + msg.author.username );
                }
            },
            "signout" : {
                desc: "Abmelden am Draft-Cup",
                process: function (bot,msg,values) {
                    let response = [];
                    msg.channel.send(response.join('\n'));
                    console.log('signout by: ' + msg.author.username );
                }
            }
        };
    }


    getDraftCupMethod () {
        return {
            'status' : 'open',
            'player_list': []
        };
    }

    getWelcomeMessage() {
        const welcome = [
            '*@user* betritt den Draft-Cup, die anderen Spieler ziehen sich bereits warm an.',
            'Ohne *@user* läuft hier nichts.',
            '*@user* betritt den Cup, jetzt wird es gefährlich.',
            'Die Stimmung erreich seinen Höhepunkt, *@user* kündigt sich an.',
            'Mit *@user* ist heute nicht zu spaßen.',
            'Wir haben Grund zum feiern, *@user* ist hier und heizt allen kräftig ein.',
            'Selbstbewusstsein hat neuen Namen, *@user*',
            'Chuck Norris kann einpacken, ab hier übernimmt *@user*',
            '*@user* hat sich angemeldet, die Panik steht allen deutlich ins Gesicht geschrieben.',
            'Mit der Anmeldung von *@user* hat das Niveau ein neues Level erreicht.',
            'Natürlich darf auch *@user* heute nicht fehlen.',
            'Mit *@user* ist immer zu rechnen, ausreden Zählen ab jetzt nicht mehr',
            '*@user* bindet sich die Maus-Hand auf den Rücken, damit andere eine Chance haben.'
        ];
        return welcome[Math.floor(Math.random()*welcome.length)];
    }
};