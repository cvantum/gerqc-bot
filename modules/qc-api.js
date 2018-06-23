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
                            response.push('**Level**: `'+qc_data.playerLevelState.level+'`');
                            response.push('**Duel**');
                            response.push('```');
                            response.push('Rating: ' + qc_data.playerRatings.duel.rating + ' ± ' + qc_data.playerRatings.duel.deviation);
                            response.push('Rank:   ' + self.calcRank(qc_data.playerRatings.duel.rating));
                            response.push('Spiele: ' + qc_data.playerRatings.duel.gamesCount);
                            response.push('```');
                            response.push('**2on2**');
                            response.push('```');
                            response.push('Rating: ' + qc_data.playerRatings.tdm.rating + ' ± ' + qc_data.playerRatings.tdm.deviation);
                            response.push('Rank:   ' + self.calcRank(qc_data.playerRatings.tdm.rating));
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

    calcRank(sr) {
        if (typeof sr === 'string') {
             sr = Number(sr);
        }
        //Bronze: 0 - 974
        if (sr < 975) {
            if ( sr < 675) {
                return 'Bronze Tier 1';
            } else if ( sr < 750 ) {
                return 'Bronze Tier 2';
            } else if ( sr < 825) {
                return 'Bronze Tier 3';
            } else if ( sr < 900) {
                return 'Bronze Tier 4';
            } else {
                return 'Bronze Tier 5';
            }
        //Silber: 975 - 1349
        } else if (sr < 1350) {
            if ( sr < 975) {
                return 'Silber Tier 1';
            } else if ( sr < 1050) {
                return 'Silber Tier 2';
            } else if ( sr < 1125) {
                return 'Silber Tier 3';
            } else if ( sr < 1200) {
                return 'Silber Tier 4';
            } else {
                return 'Silber Tier 5';
            }
        //Gold: 1350 - 1724
        } else if ( sr < 1725) {
            if ( sr < 1425) {
                return 'Gold Tier 1';
            } else if ( sr < 1500) {
                return 'Gold Tier 2';
            } else if ( sr < 1575) {
                return 'Gold Tier 3';
            } else if ( sr < 1650 ) {
                return 'Gold Tier 4';
            } else {
                return 'Gold Tier 5';
            }
        //Diamond: 1725 - 2099
        } else if ( sr < 2100) {
            if ( sr < 1800) {
                return 'Diamond Tier 1';
            } else if ( sr < 1870) {
                return 'Diamond Tier 2';
            } else if ( sr < 1950) {
                return 'Diamond Tier 3';
            } else if ( sr < 2025) {
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