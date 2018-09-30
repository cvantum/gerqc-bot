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
                desc: "Draft-Cup `help | start | close | reopen | init | list | clear | abort`",
                process: function (bot,msg,values) {
                    let response = [];
                    if (values.length === 0) {
                        response.push('Bitte Parameter angeben: `help | start | close | reopen | init | list | clear | abort`');
                    } else {
                        switch (values[0]) {
                            case 'help':
                                response.push('```');
                                response.push('help:   Diese Hilfe');
                                response.push('start:  Starte einen neuen Draft-Cup');
                                response.push('close:  Schließe die Anmeldung');
                                response.push('reopen: Öffne die Anmeldung erneut');
                                response.push('init:   Initialisiere Cup für 3on3 oder 4on4');
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
                                                    self.cup = Object.assign(self.cup, self.extendDraftCup(self.cup.player_list.keys()/3));
                                                    //self.cup = Object.assign(self.cup, self.extendDraftCup(1));
                                                    break;
                                                case '4on4':
                                                    self.cup.status = 'init';
                                                    response.push('Draft-Cup initialisiert für 4on4');
                                                    self.cup = Object.assign(self.cup, self.extendDraftCup(self.cup.player_list.keys()/4));
                                                    break;
                                                default:
                                                    response.push('Modus nicht bekannt');
                                                    break;
                                            }
                                            console.log(self.cup);
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
                                    //console.log(Object.keys(self.cup.player_list).length);
                                    if ( Object.keys(self.cup.player_list).length > 0 ) {
                                        response.push('```');
                                        for (let player in self.cup.player_list) {
                                            response.push(self.cup.player_list[player].username);
                                        }
                                        response.push('```');
                                        if ( Object.keys(self.cup.player_list).length < 6 ) {
                                            response.push('*Es fehlen noch '+(6-Object.keys(self.cup.player_list).length).toString()+' Spieler für 3on3*');
                                        } else {
                                            if ( Object.keys(self.cup.player_list).length % 3 === 0 ) {
                                                response.push('*Anzahl der Spieler ist optimal für 3on3*');
                                            } else {
                                                response.push('*Es fehlen noch '+(3-(Object.keys(self.cup.player_list).length % 3)).toString()+' Spieler für optimale 3er Teams*');
                                            }
                                        }
                                        if ( Object.keys(self.cup.player_list).length < 8 ) {
                                            response.push('*Es fehlen noch '+(8-Object.keys(self.cup.player_list).length).toString()+' Spieler für 4on4*');
                                        } else {
                                            if ( Object.keys(self.cup.player_list).length % 4 === 0 ) {
                                                response.push('*Anzahl der Spieler ist optimal für 4on4*');
                                            } else {
                                                response.push('*Es fehlen noch '+(4-(Object.keys(self.cup.player_list).length % 4)).toString()+' Spieler für optimale 4er Teams*');
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
                        if ( self.cup.status === 'open' && self.cup.player_list.hasOwnProperty(msg.author.id)) {
                            response.push('Du bist bereits angemeldet');
                        } else {
                            response.push('Du bist nun angemeldet');
                            //response.push(self.getWelcomeMessage().replace('@user', msg.author.username));
                            let id = msg.author.id;
                            self.cup.player_list[id] = msg.author;

                            if ( Object.keys(self.cup.player_list).length < 6 ) {
                                response.push('*Es fehlen noch '+(6-Object.keys(self.cup.player_list).length).toString()+' Spieler für 3on3*');
                            } else {
                                if ( Object.keys(self.cup.player_list).length % 3 === 0 ) {
                                    response.push('*Anzahl der Spieler ist optimal für 3on3*');
                                } else {
                                    response.push('*Es fehlen noch '+(3-(Object.keys(self.cup.player_list).length % 3)).toString()+' Spieler für optimale 3er Teams*');
                                }
                            }
                            if ( Object.keys(self.cup.player_list).length < 8 ) {
                                response.push('*Es fehlen noch '+(8-Object.keys(self.cup.player_list).length).toString()+' Spieler für 4on4*');
                            } else {
                                if ( Object.keys(self.cup.player_list).length % 4 === 0 ) {
                                    response.push('*Anzahl der Spieler ist optimal für 4on4*');
                                } else {
                                    response.push('*Es fehlen noch '+(4-(Object.keys(self.cup.player_list).length % 4)).toString()+' Spieler für optimale 4er Teams*');
                                }
                            }
                        }
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
                    if (self.hasOwnProperty('cup') ) {
                        if ( self.cup.status === 'open' && self.cup.player_list.hasOwnProperty(msg.author.id) ) {
                            response.push('Du bist nun abgemeldet');
                            delete self.cup.player_list[msg.author.id];

                            if ( Object.keys(self.cup.player_list).length < 6 ) {
                                response.push('*Es fehlen noch '+(6-Object.keys(self.cup.player_list).length).toString()+' Spieler für 3on3*');
                            } else {
                                if ( Object.keys(self.cup.player_list).length % 3 === 0 ) {
                                    response.push('*Anzahl der Spieler ist optimal für 3on3*');
                                } else {
                                    response.push('*Es fehlen noch '+(3-(Object.keys(self.cup.player_list).length % 3)).toString()+' Spieler für optimale 3er Teams*');
                                }
                            }
                            if ( Object.keys(self.cup.player_list).length < 8 ) {
                                response.push('*Es fehlen noch '+(8-Object.keys(self.cup.player_list).length).toString()+' Spieler für 4on4*');
                            } else {
                                if ( Object.keys(self.cup.player_list).length % 4 === 0 ) {
                                    response.push('*Anzahl der Spieler ist optimal für 4on4*');
                                } else {
                                    response.push('*Es fehlen noch '+(4-(Object.keys(self.cup.player_list).length % 4)).toString()+' Spieler für optimale 4er Teams*');
                                }
                            }
                        } else {
                            response.push('Du bist nicht angemeldet');
                        }
                    } else {
                        response.push('Kein Cup gestartet');
                    }
                    msg.channel.send(response.join('\n'));
                    console.log('signout by: ' + msg.author.username );
                }
            },
            "captain" : {
                desc: "Bestimme Team-Leader für den Draft-Cup `add + @-Erwähnung | remove + @-Erwähnung | set | list`",
                process: function (bot,msg,values) {
                    let response = [];
                    if ( self.hasOwnProperty('cup') ) {
                        if (self.cup.status === 'init' && self.cup.creator_id === msg.author.id) {
                            switch (values[0]) {
                                case 'help':
                                    response.push('```');
                                    response.push('help:   Diese Hilfe');
                                    response.push('add:    Team-Leader wählen + @-Erwähnung');
                                    response.push('remove: Team-Leader löschen + @-Erwähnung');
                                    response.push('set:    Team-Leader auswahl abschließen');
                                    response.push('list:   Liste gewählter Team-Leader');
                                    response.push('```');
                                    break;
                                case 'add':
                                    if (msg.mentions.members.array().length > 0) {
                                        console.log(msg.mentions.members.array()[0].user.id);
                                        let id = msg.mentions.members.array()[0].user.id;
                                        if (self.cup.player_list.hasOwnProperty(id)) {
                                            if (self.cup.captain_list.hasOwnProperty(id)) {
                                                response.push('Team-Leader bereits gewählt');
                                            } else {
                                                response.push('Team-Leader gewählt');
                                                self.cup.captain_list[id] = self.cup.player_list[id];
                                                if (Object.keys(self.cup.captain_list).length === Object.keys(self.cup.teams).length) {
                                                    response.push('*Anzahl an Team-Leadern erreicht*');
                                                } else {
                                                    response.push('Es fehlen noch '+(Object.keys(self.cup.teams).length-Object.keys(self.cup.captain_list).length).toString()+' Team-Leader');
                                                }
                                            }
                                        } else {
                                            response.push('Spieler nicht in der Liste');
                                        }
                                    } else {
                                        response.push('Kein Spieler ausgewählt');
                                    }
                                    break;
                                case 'remove':
                                    if (msg.mentions.members.array().length > 0) {
                                        console.log(msg.mentions.members.array()[0].user.id);
                                        let id = msg.mentions.members.array()[0].user.id;
                                        if (self.cup.captain_list.hasOwnProperty(id)) {
                                            delete self.cup.captain_list[id];
                                            response.push('Team-Leader gelöscht');
                                        } else {
                                            response.push('Spieler nicht in der Liste');
                                        }
                                    } else {
                                        response.push('Kein Spieler ausgewählt');
                                    }
                                    break;
                                case 'list':
                                    response.push('**Gewählte Team-Leader**');
                                    response.push('```');
                                    for ( let key in self.cup.captain_list) {
                                        response.push(self.cup.captain_list[key].username);
                                    }
                                    response.push('```');
                                    break;
                                case 'set':
                                    if (Object.keys(self.cup.captain_list).length === Object.keys(self.cup.teams).length) {
                                        response.push('Team-Leader gesetzt');
                                        for ( let captain in self.cup.captain_list) {
                                            delete self.cup.player_list[captain];
                                        }
                                        console.log(self.cup.captain_list);
                                        response.push('Pick-Prozess wird gestartet');
                                        self.cup.status = 'rostering'
                                    } else {
                                        response.push('Es fehlen noch '+(Object.keys(self.cup.teams).length-Object.keys(self.cup.captain_list).length).toString()+' Team-Leader');
                                    }
                                    break;
                                default:
                                    response.push('Befehl nicht erkannt `add | remove | list | set`');
                                    break;
                            }
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
                desc: "Wähle einen Spieler aus `+ @-Erwähnung`",
                process: function (bot,msg,values) {
                    let response = [];
                    if ( self.hasOwnProperty('cup')) {
                        //Ab hier passiert die Magie
                        if (self.cup.status === 'rostering') {
                            if (msg.mentions.members.array().length > 0) {
                                console.log(msg.mentions.members.array()[0].user.id);
                                let id = msg.mentions.members.array()[0].user.id;
                                if (self.cup.player_list.hasOwnProperty(id)) {
                                    // Ab hier findet die Wahl der Spieler statt
                                    response.push('Hier wird ausgewählt');
                                    //Es darf nur derjenige Wählen, der auch an der Reihe ist
                                    if (msg.author.id === Object.keys(self.cup.captain)[self.cup.team_pick]) {
                                        //Abfrage, ob hoch oder runter gezählt wird
                                        switch (self.cup.count_mode) {
                                            case 'count_up':
                                                //Wird mit dem nächsten Wähler die Länger aller Teams erreicht
                                                //muss runter gezählt werden
                                                if (self.cup.team_next_pick + 1 >= Object.keys(self.cup.captain_list).length) {
                                                    self.cup.team_pick = self.cup.team_next_pick;
                                                    self.cup.count_mode = 'count_down';
                                                } else {
                                                    self.cup.team_pick = self.cup.team_next_pick;
                                                    self.cup.team_next_pick = self.cup.team_next_pick + 1;
                                                }
                                                break;
                                            case 'count_down':
                                                //Wird mit dem nächsten Wähler die Zahl Null erreicht
                                                //muss wieder hoch gezählt werden
                                                if (self.cup.team_next_pick - 1 < 0) {
                                                    self.cup.team_pick = self.cup.team_next_pick;
                                                    self.cup.count_mode = 'count_up';
                                                } else {
                                                    self.cup.team_pick = self.cup.team_next_pick;
                                                    self.cup.team_pick = self.cup.team_next_pick - 1;
                                                }
                                                break;
                                        }
                                    } else {
                                        response.push('Du bist nicht dran');
                                    }
                                    // Nach der Wahl wird geprüft, ob noch Spieler im Pool verfügbar sind
                                    if ( self.cup.player_list.length > 0) {
                                        response.push('Nächster ist an der Reihe');
                                    } else {
                                        response.push('Alle Spieler wurden gewählt');
                                        // Nächster Status muss gesetzt werden.
                                    }
                                } else {
                                    response.push('Spieler nicht in der Liste');
                                }
                            } else {
                                response.push('Kein Spieler ausgewählt');
                            }
                        } else {
                            response.push('Cup ist noch nicht bereit');
                        }
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
                        if (self.cup.status === 'rostering') {
                            //Ab hier passiert die Magie
                            response.push('Gewählte Teams');
                            for (let team in self.cup.teams) {
                                console.log(team);
                                console.log(self.cup.teams[team]);
                                response.push('Team:');
                                response.push('Team-Leader');
                                response.push('Spieler');
                            }
                        } else {
                            response.push('Nicht möglich. Cup befindet sich im Status: `'+self.cup.status+'`');
                        }
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
            'player_list': {}
        };
    }

    extendDraftCup (team_count) {
        let extendedCup = {};
        extendedCup.captain_list = {};
        extendedCup.teams = {};
        extendedCup.count_mode = 'count_up';
        extendedCup.team_pick = 0;
        extendedCup.team_next_pick = 1;
        extendedCup.pick_count = 1;
        for (let i = 0; i < team_count; i++) {
            //console.log(i+1);
            //extendedCup.teams.push({'team_'+(i+1).toString() : []});
            let temp_team = {};
            let temp_team_name = 'team_'+(i+1).toString();
            extendedCup.teams[temp_team_name] = {players: []};
            //temp_team[temp_team_name] = [];
            //extendedCup.teams.push(temp_team);
        }
        return extendedCup;
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