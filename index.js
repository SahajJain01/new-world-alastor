const Discord = require("discord.js");
const https = require('https');

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

var url = 'https://nwdb.info/server-status/servers.json';
var worldName = 'Alastor';
var fullFlag = false;
var maintenanceFlag = false;
var downFlag = false;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.login('ODEyMjI0MjU0OTIxNDA4NTI1.YC9oyA.o5TMzTeEoNTMDt7oLn5LlRR3gFI');

setInterval(fetchDataAndUpdateTopic, 300000);

function fetchDataAndUpdateTopic() {
    https.get(url, function (res) {
        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            var data = JSON.parse(body);
            data.data.servers.forEach(e => {
                if (e[4] == worldName) {
                    var st;
                    var str = '';
                    switch (e[7]) {
                        case 12:
                            st = 'Maintenance (New Char Disabled)';
                            str += ':yellow_circle: ';
                            if(!maintenanceFlag) {
                                client.channels.cache.get('864708503058251796').send('<@&900293466444140574> Alert! ' + e[4] + ' is down for maintenance, time to go back to being productive!');
                                maintenanceFlag = true;
                            }
                            break;
                        case 8:
                            st = 'Online (New Char Disabled)';
                            str += ':green_circle: ';
                            if(maintenanceFlag) {
                                client.channels.cache.get('864708503058251796').send('<@&900293466444140574> Alert! ' + e[4] + ' maintenance completed, server is online! Did you do anything productive?');
                                maintenanceFlag = false;
                            }
                            if(downFlag) {
                                client.channels.cache.get('864708503058251796').send('<@&900293466444140574> Alert! ' + e[4] + ' is back online! Let the grind resume.');
                                downFlag = false;
                            }
                            break;
                        case 4:
                            st = 'Maintenance';
                            str += ':yellow_circle: ';
                            if(!maintenanceFlag) {
                                client.channels.cache.get('864708503058251796').send('<@&900293466444140574> Alert! ' + e[4] + ' is down for maintenance, time to go back to being productive!');
                                maintenanceFlag = true;
                            }
                            break;
                        case 0:
                            st = 'Online';
                            str += ':green_circle: ';
                            if(maintenanceFlag) {
                                client.channels.cache.get('864708503058251796').send('<@&900293466444140574> Alert! ' + e[4] + ' maintenance completed, server is online! Did you do anything productive?');
                                maintenanceFlag = false;
                            }
                            if(downFlag) {
                                client.channels.cache.get('864708503058251796').send('<@&900293466444140574> Alert! ' + e[4] + ' is back online! Let the grind resume.');
                                downFlag = false;
                            }
                            break;
                        default:
                            st = 'Unknown/Down';
                            str += ':red_circle: ';
                            if(!downFlag) {
                                client.channels.cache.get('864708503058251796').send('<@&900293466444140574> Alert! ' + e[4] + ' is down for unknown reason, time to reconsider your life decisions!');
                                downFlag = true;
                            }
                            break;
                    }
                    var t = new Date(e[3] * 1000).toISOString().substr(11, 8);
                    str += e[4] + ' - ' + (e[1] + e[2]) + '/' + e[0] + ' | Wait: ' + t + ' | Status: ' + st + ' | StatusCode: ' + e[7] + ' | Last update: ' + new Date(Date.now()).toLocaleString("en-IN", { timeZone: 'Asia/Kolkata' });
                    console.log('Sending update to discord: ' + str);
                    client.channels.cache.get('864708503058251796').setTopic(str)
                        .then(newChannel => console.log(`Channel's new topic is ${newChannel.topic}`))
                        .catch(console.error);
                    if(e[1] >= 1950 && !fullFlag) {
                        client.channels.cache.get('864708503058251796').send('<@&900293466444140574> Alert! ' + e[4] + ' is about to be full, join now if you wanna avoid queue!');
                        fullFlag = true;
                    }
                    if(e[1] <= 1750 && fullFlag) {
                        fullFlag = false;
                    }
                }
            });
        });
    }).on('error', function (e) {
        console.log("Error fetching json: ", e);
    });
}