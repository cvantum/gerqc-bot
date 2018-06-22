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
                    } else if (values[0] === 'start' && !self.hasOwnProperty('cup')) {
                        let cup = self.getDraftCupMethod();
                        self.cup = cup;
                        self.cup.creator_id = msg.author.id;
                        response.push('Cup gestartet');
                    } else if ( values[0] === 'close' && self.hasOwnProperty('cup') && self.cup.creator_id === msg.author.id ) {
                        self.cup.status = 'closed';
                        response.push('Anmeldung geschlossen');
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
                    if (self.hasOwnProperty('cup') && self.cup.status === 'open') {
                        if ( self.cup.player_list.includes(msg.author.id)) {
                            response.push('Du bist bereits angemeldet');
                        } else {
                            //response.push(self.getWelcomeMessage().replace('@user', msg.author.username));
                            response.push('Du bist nun angemeldet');
                            self.cup.player_list.push(msg.author.id);
                        }
                    } else if (self.hasOwnProperty('cup') && self.cup.status === 'closed') {
                        response.push('Anmeldung bereits geschlossen');
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
                    console.log(self);
                    if (self.hasOwnProperty('cup') && self.cup.status === 'open') {
                        if ( self.cup.player_list.includes(msg.author.id)) {
                            response.push('Du bist nun abgemeldet');
                            self.cup.player_list.splice(self.cup.player_list.indexOf(msg.author.id),1);
                        } else {
                            response.push('Du bist nicht angemeldet');
                        }
                    } else if (self.hasOwnProperty('cup') && self.cup.status === 'closed') {
                        response.push('Anmeldung geschlossen, abmelden ist nicht mehr möglich');
                    } else {
                        response.push('Kein Cup gestartet');
                    }
                    msg.channel.send(response.join('\n'));
                    console.log('signout by: ' + msg.author.username );
                }
            }
        };
    }


    getDraftCupMethod () {
        return {
            'creator_id' : '',
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