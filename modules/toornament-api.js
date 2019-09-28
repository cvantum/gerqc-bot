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
                    console.log(values);
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
                                    console.log(match_id);
                                    responseMsg.push('**Match-Nr.:** '+ match_id.toString() );
                                    responseMsg.push('> :game_die: Status: **'+match_data[match_id]['status']+'**');
                                    if (match_data[match_id]['scheduled_datetime'] === null) {
                                        responseMsg.push('> :stopwatch: Datum: *ausstehend*')
                                    } else {
                                        responseMsg.push('> :stopwatch: Datum: *'+match_data[match_id]['scheduled_datetime']+'*');
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