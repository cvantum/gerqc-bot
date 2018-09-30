"use strict";

exports.CoreCommands = class CoreCommands {
    constructor(config) {
        this.config = config;
    }

    getUserCommands() {
        return {
			"info" : {
				desc : "Get details of bot, developer and further informations",
				process: function(bot,msg,values) {
					let response = [];
					let infoText = 'Uptime: ';
					let time = bot.uptime;
					let numSec = time / 1000;
					let hour = Math.floor(numSec / 3600);
					let minute = Math.floor( ((numSec - (hour * 3600))/60) );
					let second = numSec - (hour*3600) - (minute*60);

					infoText += hour.toString() + ' hour(s), ';
					infoText += minute.toString() + ' minute(s) ';
					infoText += second.toString().split('.')[0] + ' second(s) \n';
					response.push(infoText);
					response.push('Repository: https://github.com/cvantum/gerqc-bot');
					response.push('For help, issues and feature-requests send a message to **\@cvantum**');
					msg.channel.send(response.join('\n'));
					// Log to console
					console.log('info abfrage by: ' + msg.author.username );
				}
			},
			"cointoss": {
			    desc: "Cointoss",
                process: function (bot,msg,values) {
                    let response = [];
                    let cointoss = Math.floor(Math.random() * 2);
                    console.log(cointoss);
                    if (cointoss === 0) {
                        response.push('Kopf');
                    } else {
                        response.push('Zahl');
                    }
                    msg.channel.send(response.join('\n'));
                    console.log('info abfrage by: ' + msg.author.username );
                }
            },
			"map": {
				desc: "Random-Map aus Mappool",
				process: function (bot,msg,values) {
					const mappool = ['Awoken', 'Blood Covenant','Blood Run', 'Corrupted Keep', 'Ruins of Sarnath', 'Vale of Pnath', 'The Molten Falls'];
					let response = [];
					response.push('Die Map ist: **'+mappool[Math.floor(Math.random() * mappool.length)]+'**');
					msg.channel.send(response.join('\n'));
					console.log('Random-Map für '+msg.author.username);
                }
			},
			"mappool": {
				desc: "Mappool für Generator",
				process: function (bot,msg,values) {
                    const mappool = ['Awoken', 'Blood Covenant','Blood Run', 'Corrupted Keep', 'Ruins of Sarnath', 'Vale of Pnath', 'The Molten Falls'];
					let response = [];
					response.push('**Mappool**:');
					response.push(mappool.join(', '));
					msg.channel.send(response.join('\n'));
					console.log('Mappool-Abfrage für '+msg.author.username);
                }
			},
			"duelchamps" : {
				desc: "Generator für drei Champions in Duel",
				process: function (bot,msg,values) {
					const champpool = [
						'Anarki',
						'Sorlag',
						'Slash',
						'Keel',
						'Visor',
						'Ranger',
						'Doom Slayer',
						'Scalebearer',
						'Nyx',
						'Clutch',
						'Galena',
						'B.J. Blazkowicz',
						'Strogg and Peeker',
                        'Death Knight'
					];
					let response = [];
					response.push('**Champions-Auswahl für Duel**');
					response.push('```');
					response.push(champpool.splice(Math.floor(Math.random()*champpool.length), 1));
                    response.push(champpool.splice(Math.floor(Math.random()*champpool.length), 1));
                    response.push(champpool.splice(Math.floor(Math.random()*champpool.length), 1));
					response.push('```');
                    msg.channel.send(response.join('\n'));
                    console.log('Duelchamps-Abfrage für '+msg.author.username);
                }
			}
		};
    }
};