"use strict";


const request = require('request');

exports.QcAPICommands = class QcAPICommands {
    constructor(config) {
        this.config = config;
    }

    getUserCommands() {
        return {
            "rank" : {
                dsec: "QC Ranks und Stats",
                process: function (bot,msg,values) {
                    //console.log('error:', error); // Print the error if one occurred
                    //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                    //let response = [];
                    request("https://stats.quake.com/api/v2/Player/Stats?name="+values[0], (error, response, body) => {
                        var response = [];
                        //console.log('body:', body); // Print the HTML for the Google homepage.
                        //console.log(body);
                        //console.log(JSON.parse(body).name);
                        //console.log(values);
                        if (body === '') {
                            response.push('*Kein Nutzer gefunden*');
                        } else {
                            let qc_data = JSON.parse(body);
                            response.push('**Rang für: **' + qc_data.name);
                            response.push('**Duel**');
                            response.push('```');
                            response.push('Rang: ' + qc_data.playerRatings.duel.rating);
                            response.push('Spiele: ' + qc_data.playerRatings.duel.gamesCount);
                            response.push('```');
                            response.push('**2on2**');
                            response.push('```');
                            response.push('Rang: ' + qc_data.playerRatings.tdm.rating);
                            response.push('Spiele: ' + qc_data.playerRatings.tdm.gamesCount);
                            response.push('```');
                        }
                        msg.channel.send(response.join('\n'));
                    });
                    //msg.channel.send(response.join('\n'));
                    console.log('rank aufruf by: ' + msg.author.username );
                }

            }
        };
    }
};