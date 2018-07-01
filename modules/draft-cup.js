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
                                if ( self.hasOwnProperty('cup') ) {
                                    if (self.cup.status === 'open' && self.cup.creator_id === msg.author.id) {
                                        self.cup.status = 'closed';
                                        response.push('Anmeldung geschlossen');
                                    } else {
                                        response.push('*Keine Berechtigung*');
                                    }
                                } else {
                                    response.push('Kein Cup gestartet');
                                }
                                break;
                            case 'reopen':
                                if ( self.hasOwnProperty('cup') ) {
                                    if (self.cup.status === 'closed' && self.cup.creator_id === msg.author.id) {
                                        self.cup.status = 'open';
                                        response.push('Anmeldung offen');
                                    } else {
                                        response.push('Anmeldung kann nicht erneut geöffnet werden');
                                    }
                                } else {
                                    response.push('Kein Cup gestartet');
                                }
                                break;
                            case 'init':
                                if ( self.hasOwnProperty('cup') ) {
                                    if ( self.cup.status === 'closed' && self.cup.creator_id === msg.author.id) {
                                        if (values[1]) {
                                            switch (values[1]) {
                                                case '3on3':
                                                    self.cup.status = 'init';
                                                    response.push('Draft-Cup initalisiert für 3on3');
                                                    self.cup = Object.assign(self.cup, self.extendDraftCup(self.cup.player_list/3));
                                                    break;
                                                case '4on4':
                                                    self.cup.status = 'init';
                                                    response.push('Draft-Cup initialisiert für 4on4');
                                                    self.cup = Object.assign(self.cup, self.extendDraftCup(self.cup.player_list/4));
                                                    break;
                                                default:
                                                    response.push('Modus nicht bekannt');
                                                    break;
                                            }
                                        } else {
                                            response.push('Bitte Modus angeben: `3on3 | 4on4`');
                                        }
                                    } else {
                                        response.push('Draft-Cup befindet sich im Status: `'+self.cup.status+'`');
                                    }
                                } else {
                                    response.push('Cup nicht gestartet');
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
                                        if ( self.cup.player_list.length < 6 ) {
                                            response.push('*Es fehlen noch '+(6-self.cup.player_list.length).toString()+' Spieler für 3on3*');
                                        } else {
                                            if ( self.cup.player_list.length % 3 === 0 ) {
                                                response.push('*Anzahl der Spieler ist optimal für 3on3*');
                                            } else {
                                                response.push('*Es fehlen noch '+(3-(self.cup.player_list.length % 3)).toString()+' Spieler für optimale 3er Teams*');
                                            }
                                        }
                                        if ( self.cup.player_list.length < 8 ) {
                                            response.push('*Es fehlen noch '+(8-self.cup.player_list.length).toString()+' Spieler für 4on4*');
                                        } else {
                                            if ( self.cup.player_list.length % 4 === 0 ) {
                                                response.push('*Anzahl der Spieler ist optimal für 4on4*');
                                            } else {
                                                response.push('*Es fehlen noch '+(4-(self.cup.player_list.length % 4)).toString()+' Spieler für optimale 4er Teams*');
                                            }
                                        }
                                    } else {
                                        response.push('Keine Spieler angemeldet');
                                    }
                                } else {
                                    response.push('Kein Cup gestartet');
                                }
                                break;
                            case 'clear':
                                if ( self.hasOwnProperty('cup')) {
                                    if ( self.cup.creator_id === msg.author.id ) {
                                        delete self.cup;
                                        self.cup = self.getDraftCupMethod();
                                        self.cup.creator_id = msg.author.id;
                                        response.push('Alle Daten zurück gesetzt');
                                    } else {
                                        response.push('*Keine Berechtigung*');
                                    }
                                } else {
                                    response.push('Kein Cup gestartet');
                                }
                                break;
                            case 'abort':
                                if ( self.hasOwnProperty('cup') ) {
                                    if (self.cup.creator_id === msg.author.id) {
                                        delete self.cup;
                                        response.push('Turnier abgebrochen');
                                    } else {
                                        response.push('*Keine Berechtigung*');
                                    }
                                } else {
                                    response.push('Kein Cup gestartet');
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
                    if (self.hasOwnProperty('cup') ) {
                        if ( self.cup.status === 'open' && self.cup.player_list.includes(msg.author)) {
                            response.push('Du bist bereits angemeldet');
                        } else {
                            response.push('Du bist nun angemeldet');
                            //response.push(self.getWelcomeMessage().replace('@user', msg.author.username));
                            self.cup.player_list.push(msg.author);

                            if ( self.cup.player_list.length < 6 ) {
                                response.push('*Es fehlen noch '+(6-self.cup.player_list.length).toString()+' Spieler für 3on3*');
                            } else {
                                if ( self.cup.player_list.length % 3 === 0 ) {
                                    response.push('*Anzahl der Spieler ist optimal für 3on3*');
                                } else {
                                    response.push('*Es fehlen noch '+(3-(self.cup.player_list.length % 3)).toString()+' Spieler für optimale 3er Teams*');
                                }
                            }
                            if ( self.cup.player_list.length < 8 ) {
                                response.push('*Es fehlen noch '+(8-self.cup.player_list.length).toString()+' Spieler für 4on4*');
                            } else {
                                if ( self.cup.player_list.length % 4 === 0 ) {
                                    response.push('*Anzahl der Spieler ist optimal für 4on4*');
                                } else {
                                    response.push('*Es fehlen noch '+(4-(self.cup.player_list.length % 4)).toString()+' Spieler für optimale 4er Teams*');
                                }
                            }
                        }
                    } else if (self.cup.status === 'closed') {
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
                    if (self.hasOwnProperty('cup') ) {
                        if ( self.cup.status === 'open' && self.cup.player_list.includes(msg.author) ) {
                            response.push('Du bist nun abgemeldet');
                            self.cup.player_list.splice(self.cup.player_list.indexOf(msg.author),1);

                            if ( self.cup.player_list.length < 6 ) {
                                response.push('*Es fehlen noch '+(6-self.cup.player_list.length).toString()+' Spieler für 3on3*');
                            } else {
                                if ( self.cup.player_list.length % 3 === 0 ) {
                                    response.push('*Anzahl der Spieler ist optimal für 3on3*');
                                } else {
                                    response.push('*Es fehlen noch '+(3-(self.cup.player_list.length % 3)).toString()+' Spieler für optimale 3er Teams*');
                                }
                            }
                            if ( self.cup.player_list.length < 8 ) {
                                response.push('*Es fehlen noch '+(8-self.cup.player_list.length).toString()+' Spieler für 4on4*');
                            } else {
                                if ( self.cup.player_list.length % 4 === 0 ) {
                                    response.push('*Anzahl der Spieler ist optimal für 4on4*');
                                } else {
                                    response.push('*Es fehlen noch '+(4-(self.cup.player_list.length % 4)).toString()+' Spieler für optimale 4er Teams*');
                                }
                            }
                        } else {
                            response.push('Du bist nicht angemeldet');
                        }
                    } else if ( self.cup.status === 'closed' ) {
                        response.push('Anmeldung geschlossen, abmelden ist nicht mehr möglich');
                    } else {
                        response.push('Kein Cup gestartet');
                    }
                    msg.channel.send(response.join('\n'));
                    console.log('signout by: ' + msg.author.username );
                }
            },
            "captain" : {
                desc: "Bestimme Team-Leader für den Draft-Cup `add | remove + @-Mention`",
                process: function (bot,msg,values) {
                    let response = [];
                    if ( self.hasOwnProperty('cup') ) {
                        if (self.cup.status === 'init' && self.cup.creator_id === msg.author.id) {
                            switch (values[0]) {
                                case 'add':
                                    response.push('Team-Leader gewählt');
                                    break;
                                case 'remove':
                                    response.push('Team-Leader gelöscht');
                                    break;
                                default:
                                    response.push('Befehl nicht erkannt `add | remove`');
                                    break;
                            }
                            console.log(msg.mentions.users);
                            console.log(values[1]);
                        } else {
                            response.push('Befehl wurde nicht ausgeführt');
                        }
                    } else {
                        response.push('Cup nicht gestartet');
                    }
                    msg.channel.send(response.join('\n'));
                    console.log('captain by: ' + msg.author.username );
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
                    console.log('pick by: ' + msg.author.username );
                }
            },
            "teams" : {
                desc: "Gewählte Teams",
                process: function (bot,msg,values) {
                    let response = [];
                    if ( self.hasOwnProperty('cup')) {
                        //Ab hier passiert die Magie
                        response.push('Darstellung der Teams');
                    } else {
                        response.push('Cup nicht gestartet')
                    }
                    msg.channel.send(response.join('\n'));
                    console.log('teams by: ' + msg.author.username );
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

    extendDraftCup (team_count) {
        let extendedCup = {};
        extendedCup.captain_array = [];
        for (let i = 0; i < team_count; i++) {
            console.log(i+1);
            extendedCup['team_'+(i+1).toString()] = [];
        }
    }

    calcRemainingPlayers() {
        let response = [];
        if ( self.cup.player_list.length < 6 ) {
            response.push('*Es fehlen noch '+6-self.cup.player_list.length+' Spieler für 3on3*');
        } else {
            if ( self.cup.player_list.length % 3 === 0 ) {
                response.push('*Anzahl der Spieler ist optimal für 3on3*');
            } else {
                response.push('*Es fehlen noch '+3-(self.cup.player_list.length % 3)+' Spieler*');
            }
        }
        if ( self.cup.player_list.length < 8 ) {
            response.push('*Es fehlen noch '+8-self.cup.player_list.length+' Spieler für 4on4*');
        } else {
            if ( self.cup.player_list.length % 4 === 0 ) {
                response.push('*Anzahl der Spieler ist optimal für 4on4*');
            } else {
                response.push('*Es fehlen noch '+4-(self.cup.player_list.length % 4)+' Spieler*');
            }
        }
        return response
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