"use strict";


const request = require('request');

exports.QcAPICommands = class QcAPICommands {
    constructor(config) {
        this.config = config;
    }

    getUserCommands() {
        return {
            "rank" : {
                desc: "QC SR und Stats",
                process: function (bot,msg,values) {
                    //console.log('error:', error); // Print the error if one occurred
                    //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                    //let response = [];
                    request("https://stats.quake.com/api/v2/Player/Stats?name="+values.join('%20'), (error, response, body) => {
                        var response = [];
                        //console.log('body:', body); // Print the HTML for the Google homepage.
                        //console.log(body);
                        //console.log(JSON.parse(body).name);
                        //console.log(values);
                        if (body === '') {
                            response.push('*Kein Nutzer gefunden*');
                        } else {
                            let qc_data = JSON.parse(body);
                            response.push('**Stats für: **' + qc_data.name);
                            response.push('**Level**:`'+qc_data.playerLevelState.level+'`');
                            response.push('**Duel**');
                            response.push('```');
                            response.push('Rating: ' + qc_data.playerRatings.duel.rating + '±' + qc_data.playerRatings.duel.deviation);
                            response.push('Spiele: ' + qc_data.playerRatings.duel.gamesCount);
                            response.push('```');
                            response.push('**2on2**');
                            response.push('```');
                            response.push('Rating: ' + qc_data.playerRatings.tdm.rating + '±' + qc_data.playerRatings.tdm.deviation);
                            response.push('Spiele: ' + qc_data.playerRatings.tdm.gamesCount);
                            response.push('```');
                        }
                        msg.channel.send(response.join('\n'));
                    });
                    //msg.channel.send(response.join('\n'));
                    console.log('rank aufruf by: ' + msg.author.username );
                }

            },
            "lfp" : {
                desc: "Suche nach Spielern mit ähnlichem SR",
                process: function (bot,msg,values) {
                    if (values[0] === 'duel') {

                    } else if (values[0] === '2on2') {

                    } else {

                    }
                    console.log('lfp aufruf by: ' + msg.author.username );
                }
            }
        };
    }
};