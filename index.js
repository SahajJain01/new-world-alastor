const Discord = require("discord.js");
const https = require('https');

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

var url = 'https://nwdb.info/server-status/data.json';
var worldName = 'Alastor';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.login('ODEyMjI0MjU0OTIxNDA4NTI1.YC9oyA.o5TMzTeEoNTMDt7oLn5LlRR3gFI');

setInterval(fetchDataAndUpdateTopic, 600000);

function fetchDataAndUpdateTopic() {
    https.get(url, function (res) {
        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            var data = JSON.parse(body);
            data.data.servers.forEach(e => {
                if (e.worldName == worldName) {
                    var st;
                    switch (e.status) {
                        case 12:
                            st = 'Maintenance'
                            break;
                        case 8:
                            st = 'Online/Full'
                            break;
                        case 4:
                            st = 'Online'
                            break;
                        case 0:
                            st = 'Offline'
                            break;
                        default:
                            st = 'Unknown'
                            break;
                    }
                    var t = new Date(e.queueTime * 1000).toISOString().substr(11, 8);
                    var str = e.worldName + ' - ' + (e.connectionCount + e.queueCount) + '/' + e.connectionCountMax + ' | Wait: ' + t + ' | Status: ' + st + ' | StatusCode: ' + e.status + ' | Last update: ' + new Date(Date.now()).toLocaleString("en-IN", { timeZone: 'Asia/Kolkata' });
                    console.log('Sending update to discord: ' + str);
                    client.channels.cache.get('864708503058251796').setTopic(str)
                        .then(newChannel => console.log(`Channel's new topic is ${newChannel.topic}`))
                        .catch(console.error);
                }
            });
        });
    }).on('error', function (e) {
        console.log("Error fetching json: ", e);
    });
}