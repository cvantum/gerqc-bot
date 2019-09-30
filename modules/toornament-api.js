"use strict";


const request = require('request');

exports.ToorAPICommands = class ToorAPICommands {
    constructor(config) {
        let self = this;
        self.config = config;
    }

    getUserCommands() {
        let self = this;
        return {
            "matches" : {
                desc: "Matches pro Spieler",
                process: function (bot,msg,values) {
                    if (values.length === 0) {
                        let responseMsg = [];
                        responseMsg.push("Bitte Spieler angeben");
                        msg.channel.send(responseMsg.join('\n'));
                    } else if (typeof self.mapToorIdToUser(values[0]) !== 'undefined' && self.mapToorIdToUser(values[0])) {
                        let options = {
                            url: 'https://api.toornament.com/viewer/v2/tournaments/2728910676650975232/matches?participant_ids='+self.mapToorIdToUser(values[0]),
                            headers: {
                                'X-Api-Key': self.config.toornament_token,
                                'Range': 'matches=0-127'
                            }
                        };
                        request( options, (error, response, body) => {
                            let responseMsg = [];
                            if (body === '') {
                                responseMsg.push('*Keine Daten gefunden*');
                            } else {
                                let match_data = JSON.parse(body);
                                //console.log(match_data);
                                responseMsg.push('Spiele für: '+values[0]);
                                for (let match_id in match_data) {
                                    responseMsg.push('**Match-Nr.:** '+ match_id.toString() );
                                    responseMsg.push('> :game_die: Status: **'+match_data[match_id]['status']+'**');
                                    if (match_data[match_id]['scheduled_datetime'] === null) {
                                        responseMsg.push('> :stopwatch: Datum: *ausstehend*')
                                    } else {
                                        let dateconv_day = new Date(match_data[match_id]['scheduled_datetime']).toLocaleDateString('de-DE');
                                        let dateconv_date = new Date(match_data[match_id]['scheduled_datetime']).toLocaleTimeString('de-DE');
                                        responseMsg.push('> :stopwatch: Datum: *'+dateconv_day+' '+dateconv_date+'*');
                                    }
                                    responseMsg.push('> Spieler1: `'+match_data[match_id]['opponents'][0]['participant']['name']+'`');
                                    responseMsg.push('> Spieler2: `'+match_data[match_id]['opponents'][1]['participant']['name']+'`');
                                }
                            }
                            msg.channel.send(responseMsg.join('\n'));
                        });
                    } else {
                        let responseMsg = [];
                        responseMsg.push("Name ist ungültig");
                        msg.channel.send(responseMsg.join('\n'));
                    }
                    console.log('matches aufruf by: ' + msg.author.username );
                }
            },
            "scheduled" : {
                desc: "Offene Matches mit Datum",
                process: function (bot,msg,values) {
                    let options = {
                        url: 'https://api.toornament.com/viewer/v2/tournaments/2728910676650975232/matches?is_scheduled=1&sort=schedule&statuses=pending',
                        headers: {
                            'X-Api-Key': self.config.toornament_token,
                            'Range': 'matches=0-127'
                        }
                    };
                    request( options, (error, response, body) => {
                        let responseMsg = [];
                        if (body === '') {
                            responseMsg.push('*Keine Daten gefunden*');
                        } else {
                            let match_data = JSON.parse(body);
                            //console.log(match_data);
                            responseMsg.push('Ausstehende Spiele');
                            for (let match_id in match_data) {
                                let dateconv_day = new Date(match_data[match_id]['scheduled_datetime']).toLocaleDateString('de-DE');
                                let dateconv_date = new Date(match_data[match_id]['scheduled_datetime']).toLocaleTimeString('de-DE');
                                responseMsg.push('**Match-Nr.:** '+ match_id.toString() );
                                responseMsg.push('> :game_die: Status: **'+match_data[match_id]['status']+'**');
                                responseMsg.push('> :stopwatch: Datum: *'+dateconv_day+' '+dateconv_date+'*');
                                responseMsg.push('> Spieler1: `'+match_data[match_id]['opponents'][0]['participant']['name']+'`');
                                responseMsg.push('> Spieler2: `'+match_data[match_id]['opponents'][1]['participant']['name']+'`');
                            }
                        }
                        msg.channel.send(responseMsg.join('\n'));
                    });
                    console.log('schedulued aufruf by: ' + msg.author.username );
                }
            },
            "div1" : {
                desc: "Division 1",
                process: function (bot, msg, values) {
                    let options = {
                        url: 'https://api.toornament.com/viewer/v2/tournaments/' + self.config.toornament_cupid + '/stages/2893116271035482112/ranking-items',
                        headers: {
                            'X-Api-Key': self.config.toornament_token,
                            'Range': 'items=0-40'
                        }
                    };
                    request(options, (error, response, body) => {
                        let responseMsg = [];
                        if (body === '') {
                            responseMsg.push('*Keine Daten gefunden*');
                        } else {
                            let div_data = JSON.parse(body);
                            //console.log(div_data);
                            responseMsg.push('**Division 1**');
                            responseMsg.push('```');
                            responseMsg.push('| Platz | Name                 | Punkte  | S   | N   | G   |');
                            for (let player in div_data) {
                                let rank = div_data[player]['position'].toString();
                                let name = div_data[player]['participant']['name'];
                                //let points = div_data[player]['points'].toString();
                                let points = '0';
                                let wins = div_data[player]['properties']['wins'].toString();
                                let losses = div_data[player]['properties']['losses'].toString();
                                let total = div_data[player]['properties']['played'].toString();
                                // Rank fill with spaces
                                let rank_space_fill = 5 - rank.length;
                                let rank_spaces = Array(rank_space_fill).fill(' ').join('');
                                // Name fill with spaces
                                let name_space_fill = 20 - name.length;
                                let name_spaces = Array(name_space_fill).fill(' ').join('');
                                // Points fill with spaces
                                let points_space_fill = 7 - points.length;
                                let points_spaces = Array(points_space_fill).fill(' ').join('');
                                // Wins fill with spaces
                                let wins_space_fill = 3 - wins.length;
                                let wins_spaces = Array(wins_space_fill).fill(' ').join('');
                                // Losses fill with spaces
                                let losses_space_fill = 3 - losses.length;
                                let losses_spaces = Array(losses_space_fill).fill(' ').join('');
                                // Total fill with spaces
                                let total_space_fill = 3 - total.length;
                                let total_spaces = Array(total_space_fill).fill(' ').join('');
                                responseMsg.push('| '+rank+rank_spaces+' | '+name+name_spaces+' | '+points+points_spaces+' | '+wins+wins_spaces+' | '+losses+losses_spaces+' | '+total+total_spaces+' |');
                            }
                            responseMsg.push('```');
                        }
                        msg.channel.send(responseMsg.join('\n'));
                    });
                    console.log('div1 aufruf by: ' + msg.author.username);
                }
            },
            "div2" : {
                desc: "Division 2",
                process: function (bot, msg, values) {
                    let options = {
                        url: 'https://api.toornament.com/viewer/v2/tournaments/' + self.config.toornament_cupid + '/stages/2893113189662072832/ranking-items',
                        headers: {
                            'X-Api-Key': self.config.toornament_token,
                            'Range': 'items=0-40'
                        }
                    };
                    request(options, (error, response, body) => {
                        let responseMsg = [];
                        if (body === '') {
                            responseMsg.push('*Keine Daten gefunden*');
                        } else {
                            let div_data = JSON.parse(body);
                            //console.log(div_data);
                            responseMsg.push('**Division 2**');
                            responseMsg.push('```');
                            responseMsg.push('| Platz | Name                 | Punkte  | S   | N   | G   |');
                            for (let player in div_data) {
                                let rank = div_data[player]['position'].toString();
                                let name = div_data[player]['participant']['name'];
                                //let points = div_data[player]['points'].toString();
                                let points = '0';
                                let wins = div_data[player]['properties']['wins'].toString();
                                let losses = div_data[player]['properties']['losses'].toString();
                                let total = div_data[player]['properties']['played'].toString();
                                // Rank fill with spaces
                                let rank_space_fill = 5 - rank.length;
                                let rank_spaces = Array(rank_space_fill).fill(' ').join('');
                                // Name fill with spaces
                                let name_space_fill = 20 - name.length;
                                let name_spaces = Array(name_space_fill).fill(' ').join('');
                                // Points fill with spaces
                                let points_space_fill = 7 - points.length;
                                let points_spaces = Array(points_space_fill).fill(' ').join('');
                                // Wins fill with spaces
                                let wins_space_fill = 3 - wins.length;
                                let wins_spaces = Array(wins_space_fill).fill(' ').join('');
                                // Losses fill with spaces
                                let losses_space_fill = 3 - losses.length;
                                let losses_spaces = Array(losses_space_fill).fill(' ').join('');
                                // Total fill with spaces
                                let total_space_fill = 3 - total.length;
                                let total_spaces = Array(total_space_fill).fill(' ').join('');
                                responseMsg.push('| '+rank+rank_spaces+' | '+name+name_spaces+' | '+points+points_spaces+' | '+wins+wins_spaces+' | '+losses+losses_spaces+' | '+total+total_spaces+' |');
                            }
                            responseMsg.push('```');
                        }
                        msg.channel.send(responseMsg.join('\n'));
                    });
                    console.log('div1 aufruf by: ' + msg.author.username);
                }
            },
            "div3" : {
                desc: "Division 3",
                process: function (bot, msg, values) {
                    let options = {
                        url: 'https://api.toornament.com/viewer/v2/tournaments/' + self.config.toornament_cupid + '/stages/2893111794650316800/ranking-items',
                        headers: {
                            'X-Api-Key': self.config.toornament_token,
                            'Range': 'items=0-40'
                        }
                    };
                    request(options, (error, response, body) => {
                        let responseMsg = [];
                        if (body === '') {
                            responseMsg.push('*Keine Daten gefunden*');
                        } else {
                            let div_data = JSON.parse(body);
                            //console.log(div_data);
                            responseMsg.push('**Division 3**');
                            responseMsg.push('```');
                            responseMsg.push('| Platz | Name                 | Punkte  | S   | N   | G   |');
                            for (let player in div_data) {
                                let rank = div_data[player]['position'].toString();
                                let name = div_data[player]['participant']['name'];
                                //let points = div_data[player]['points'].toString();
                                let points = '0';
                                let wins = div_data[player]['properties']['wins'].toString();
                                let losses = div_data[player]['properties']['losses'].toString();
                                let total = div_data[player]['properties']['played'].toString();
                                // Rank fill with spaces
                                let rank_space_fill = 5 - rank.length;
                                let rank_spaces = Array(rank_space_fill).fill(' ').join('');
                                // Name fill with spaces
                                let name_space_fill = 20 - name.length;
                                let name_spaces = Array(name_space_fill).fill(' ').join('');
                                // Points fill with spaces
                                let points_space_fill = 7 - points.length;
                                let points_spaces = Array(points_space_fill).fill(' ').join('');
                                // Wins fill with spaces
                                let wins_space_fill = 3 - wins.length;
                                let wins_spaces = Array(wins_space_fill).fill(' ').join('');
                                // Losses fill with spaces
                                let losses_space_fill = 3 - losses.length;
                                let losses_spaces = Array(losses_space_fill).fill(' ').join('');
                                // Total fill with spaces
                                let total_space_fill = 3 - total.length;
                                let total_spaces = Array(total_space_fill).fill(' ').join('');
                                responseMsg.push('| '+rank+rank_spaces+' | '+name+name_spaces+' | '+points+points_spaces+' | '+wins+wins_spaces+' | '+losses+losses_spaces+' | '+total+total_spaces+' |');
                            }
                            responseMsg.push('```');
                        }
                        msg.channel.send(responseMsg.join('\n'));
                    });
                    console.log('div1 aufruf by: ' + msg.author.username);
                }
            }
        };
    }
    mapToorIdToUser(id) {
        id = id.toLowerCase();
        const DIV = {
            "plonga": "2832039015834017814",
            "exoplus": "2833145371873361938",
            "wimaz": "2833362703295987733",
            "taka": "2833375642684334103",
            "gravydanger": "2833440771469590555",
            "st4ycold": "2833810690910519314",
            "kanuve": "2834048903220920352",
            "eyepex": "2834259475177775126",
            "kellox": "2834387570267267111",
            "tonar": "2834422570185498663",
            "kw0w": "2834655273348579344",
            "killua": "2834833084991029277",
            "masi": "2836120805361188903",
            "ak1ra": "2836381420076040205",
            "rch": "2837241667651493908",
            "freme": "2844935054793908247",
            "telly": "2847548489314648088",
            "onicorn": "2851774094250713108",
            "darksideofsanta": "2854131326216912904",
            "tood4loo": "2855204009856942094",
            "headbang3r": "2866008712760197153",
            "loomup": "2875198369180278811",
            "bobel": "2878087380163371031",
            "ybrlgn": "2889872545704001569",
            "koreagrinder": "2889878655391539234",
            "sinthesis": "2889955473768038402",
            "j0ker": "2892415219272032268",
            "g0ldfing3r": "2893027246530830336",
            "thyr": "2894899464499331072",
            "bse": "2895649279743107087",
            "x3m": "2898466858167205923"
        };
        return DIV[id];
    }
};