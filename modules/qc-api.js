"use strict";


const request = require('request');

exports.QcAPICommands = class QcAPICommands {
    constructor(config) {
        let self = this;
        self.config = config;
    }

    getUserCommands() {
        let self = this;
        return {
            "rank" : {
                desc: "QC SR und Stats",
                process: function (bot,msg,values) {
                    //console.log('error:', error); // Print the error if one occurred
                    //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                    //let response = [];
                    request("https://stats.quake.com/api/v2/Player/Stats?name="+values.join('%20'), (error, response, body) => {
                        let responseMsg = [];
                        //console.log('body:', body); // Print the HTML for the Google homepage.
                        //console.log(body);
                        //console.log(JSON.parse(body).name);
                        //console.log(values);
                        if (body === '') {
                            responseMsg.push('*Kein Nutzer gefunden*');
                        } else {
                            let qc_data = JSON.parse(body);
                            responseMsg.push('**Stats für: **' + qc_data.name);
                            responseMsg.push('**Level**: `'+qc_data.playerLevelState.level+'`');
                            responseMsg.push('**Duel**');
                            responseMsg.push('```');
                            responseMsg.push('Rating: ' + qc_data.playerRatings.duel.rating + ' ± ' + qc_data.playerRatings.duel.deviation);
                            responseMsg.push('Rank:   ' + self.calcRank(qc_data.playerRatings.duel.rating));
                            responseMsg.push('Spiele: ' + qc_data.playerRatings.duel.gamesCount);
                            responseMsg.push('```');
                            responseMsg.push('**2on2**');
                            responseMsg.push('```');
                            responseMsg.push('Rating: ' + qc_data.playerRatings.tdm.rating + ' ± ' + qc_data.playerRatings.tdm.deviation);
                            responseMsg.push('Rank:   ' + self.calcRank(qc_data.playerRatings.tdm.rating));
                            responseMsg.push('Spiele: ' + qc_data.playerRatings.tdm.gamesCount);
                            responseMsg.push('```');
                        }
                        msg.channel.send(responseMsg.join('\n'));
                    });
                    //msg.channel.send(response.join('\n'));
                    console.log('rank aufruf by: ' + msg.author.username );
                }

            },
            "status" : {
                desc: "Status von Quake Champions",
                process: function (bot,msg,values) {
                    request("https://bethesda.net/de/status/api/statuses", (error, response, body) => {
                        let responseMsg = [];
                        if (body === '') {
                            responseMsg.push('*Keine Daten gefunden*');
                        } else {
                            let status_data = JSON.parse(body);
                            responseMsg.push('**Quake Champions Status-Update**');
                            for ( let game in status_data.components) {
                                if ( status_data.components[game].name === "Quake Champions") {
                                    responseMsg.push('Server-Status: `'+status_data.components[game].status+'`');
                                    responseMsg.push('Letztes Status-Update: `'+status_data.components[game].updated_at+'`');
                                }
                            }
                        }
                        msg.channel.send(responseMsg.join('\n'));
                    });
                    console.log('status aufruf by: ' + msg.author.username );
                }
            },
 /**           "lfp" : {
                desc: "Suche nach Spielern mit ähnlichem SR",
                process: function (bot,msg,values) {
                    if (values[0] === 'duel') {

                    } else if (values[0] === '2on2') {

                    } else {

                    }
                    console.log('lfp aufruf by: ' + msg.author.username );
                }
            }
  **/
        };
    }
    calcRank(sr) {
        if (typeof sr === 'string') {
             sr = Number(sr);
        }
        //Bronze: 0 - 974
        if (sr < 1075) {
            if ( sr < 775) {
                return 'Bronze Tier 1';
            } else if ( sr < 850 ) {
                return 'Bronze Tier 2';
            } else if ( sr < 925) {
                return 'Bronze Tier 3';
            } else if ( sr < 1000) {
                return 'Bronze Tier 4';
            } else {
                return 'Bronze Tier 5';
            }
        //Silber: 975 - 1349
        } else if (sr < 1450) {
            if ( sr < 1150) {
                return 'Silber Tier 1';
            } else if ( sr < 1225) {
                return 'Silber Tier 2';
            } else if ( sr < 1300) {
                return 'Silber Tier 3';
            } else if ( sr < 1375) {
                return 'Silber Tier 4';
            } else {
                return 'Silber Tier 5';
            }
        //Gold: 1350 - 1724
        } else if ( sr < 1825) {
            if ( sr < 1525) {
                return 'Gold Tier 1';
            } else if ( sr < 1600) {
                return 'Gold Tier 2';
            } else if ( sr < 1675) {
                return 'Gold Tier 3';
            } else if ( sr < 1750 ) {
                return 'Gold Tier 4';
            } else {
                return 'Gold Tier 5';
            }
        //Diamond: 1725 - 2099
        } else if ( sr < 2200) {
            if ( sr < 1900) {
                return 'Diamond Tier 1';
            } else if ( sr < 1970) {
                return 'Diamond Tier 2';
            } else if ( sr < 2050) {
                return 'Diamond Tier 3';
            } else if ( sr < 2125) {
                return 'Diamond Tier 4';
            } else {
                return 'Diamond Tier 5';
            }
        //Elite: ab 2100
        } else {
            return 'Elite';
        }
    }
};