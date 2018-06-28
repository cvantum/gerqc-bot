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
                desc: "Draft-Cup start | stop | clear | help | close | reopen | abort | list",
                process: function (bot,msg,values) {
                    let response = [];
                    if (values.length === 0) {
                        response.push('Bitte Parameter angeben: `help | start | close | reopen | abort | clear | list`');
                    } else {
                        switch (values[0]) {
                            case 'help':
                                response.push('```');
                                response.push('help:   Diese Hilfe');
                                response.push('start:  Starte einen neuen Draft-Cup');
                                response.push('close:  Schließe die Anmeldung');
                                response.push('reopen: Öffne die Anmeldung erneut');
                                response.push('list:   Auflistung aller Spieler');
                                response.push('abort:  Abbrechen des Vorgangs');
                                response.push('clear:  Reset der bisherigen Daten');
                                response.push('```');
                                break;
                            case 'start':
                                if (!self.hasOwnProperty('cup')) {
                                    self.cup = self.getDraftCupMethod();
                                    self.cup.creator_id = msg.author.id;
                                    response.push('Cup gestartet');
                                }
                                break;
                            case 'close':
                                if ( self.hasOwnProperty('cup') && self.cup.creator_id === msg.author.id ) {
                                    self.cup.status = 'closed';
                                    response.push('Anmeldung geschlossen');
                                }
                                break;
                            case 'reopen':
                                if ( self.hasOwnProperty('cup') && self.cup.creator_id === msg.author.id ) {
                                    if (self.cup.status === 'closed') {
                                        self.cup.status = 'open';
                                        response.push('Anmeldung offen');
                                    } else {
                                        response.push('Anmeldung kann nicht erneut geöffnet werden');
                                    }
                                }
                                break;
                            case 'init':
                                if ( self.hasOwnProperty('cup') && self.cup.creator_id === msg.author.id ) {
                                    if ( self.cup.status === 'closed') {
                                        switch (values[1]) {
                                            case '3on3':
                                                self.cup.status = 'init';
                                                response.push('Draft-Cup initalisiert für 3on3');
                                                break;
                                            case '4on4':
                                                self.cup.status = 'init';
                                                response.push('Draft-Cup initialisiert für 4on4');
                                                break;
                                            default:
                                                response.push('Modus nicht bekannt');
                                                break;
                                        }
                                    }
                                }
                                break;
                            case 'list':
                                if ( self.hasOwnProperty('cup')) {
                                    console.log(self.cup.player_list.length);
                                    if ( self.cup.player_list.length > 0 ) {
                                        response.push('```');
                                        for (let player in self.cup.player_list) {
                                            response.push(self.cup.player_list[player].username);
                                        }
                                        response.push('```');
                                    } else {
                                        response.push('Keine Spieler angemeldet');
                                    }
                                } else {
                                    response.push('Kein Cup gestartet');
                                }
                                break;
                            case 'clear':
                                if ( self.hasOwnProperty('cup') && self.cup.creator_id === msg.author.id ) {
                                    delete self.cup;
                                    self.cup = self.getDraftCupMethod();
                                    self.cup.creator_id = msg.author.id;
                                    response.push('Alle Daten zurück gesetzt');
                                }
                                break;
                            case 'abort':
                                if ( self.hasOwnProperty('cup') && self.cup.creator_id === msg.author.id ) {
                                    delete self.cup;
                                    response.push('Turnier abgebrochen');
                                }
                                break;
                            default:
                                response.push('Befehl nicht erkannt');
                                break;
                        }
                    }
                    msg.channel.send(response.join('\n'));
                    console.log('draft aufruf by: ' + msg.author.username );
                }
            },
            "signup" : {
                desc: "Anmelden am Draft-Cup",
                process: function (bot,msg,values) {
                    let response = [];
                    if (self.hasOwnProperty('cup') && self.cup.status === 'open') {
                        if ( self.cup.player_list.includes(msg.author)) {
                            response.push('Du bist bereits angemeldet');
                        } else {
                            //response.push(self.getWelcomeMessage().replace('@user', msg.author.username));
                            response.push('Du bist nun angemeldet');
                            self.cup.player_list.push(msg.author);
                        }
                    } else if (self.hasOwnProperty('cup') && self.cup.status === 'closed') {
                        response.push('Anmeldung bereits geschlossen');
                    } else {
                        response.push('Kein Cup gestartet');
                    }
                    msg.channel.send(response.join('\n'));
                    console.log('signup by: ' + msg.author.username );
                    console.log(self.cup);
                }
            },
            "signout" : {
                desc: "Abmelden am Draft-Cup",
                process: function (bot,msg,values) {
                    let response = [];
                    console.log(self);
                    if (self.hasOwnProperty('cup') && self.cup.status === 'open') {
                        if ( self.cup.player_list.includes(msg.author)) {
                            response.push('Du bist nun abgemeldet');
                            self.cup.player_list.splice(self.cup.player_list.indexOf(msg.author),1);
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
            },
            "captain" : {
                desc: "Bestimme Team-Leader für den Draft-Cup",
                process: function (bot,msg,values) {
                    let response = [];
                    if ( self.hasOwnProperty('cup')) {
                        if (self.cup.status === 'init' && self.cup.creator_id === msg.author.id) {
                            response.push(values[0]);
                        } else {
                            response.push('Befehl wurde nicht ausgeführt');
                        }
                    } else {
                        response.push('Cup nicht gestartet');
                    }
                    msg.channel.send(response.join('\n'));
                    console.log('signout by: ' + msg.author.username );
                }
            },
            "pick" : {
                desc: "Wähle einen Spieler aus",
                process: function (bot,msg,values) {
                    let response = [];
                    if ( self.hasOwnProperty('cup')) {
                        //Ab hier passiert die Magie
                        response.push('Hier wird ausgewählt');
                    } else {
                        response.push('Cup nicht gestartet')
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