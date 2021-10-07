const Discord = require("discord.js");
const https = require('https');

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

var url = 'https://nwdb.info/server-status/data.json';
var worldName = 'Alastor';
var fullFlag = false;

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
                if (e.worldName == worldName) {
                    var st;
                    var str = '';
                    switch (e.status) {
                        case 12:
                            st = 'Maintenance';
                            str += ':yellow_circle: ';
                            break;
                        case 8:
                            st = 'Online (New Char Disabled)';
                            str += ':green_circle: ';
                            break;
                        case 4:
                            st = 'Down';
                            str += ':red_circle: ';
                            break;
                        case 0:
                            st = 'Online';
                            str += ':green_circle: ';
                            break;
                        default:
                            st = 'Unknown';
                            str += ':x: '
                            break;
                    }
                    var t = new Date(e.queueTime * 1000).toISOString().substr(11, 8);
                    str += e.worldName + ' - ' + (e.connectionCount + e.queueCount) + '/' + e.connectionCountMax + ' | Wait: ' + t + ' | Status: ' + st + ' | StatusCode: ' + e.status + ' | Last update: ' + new Date(Date.now()).toLocaleString("en-IN", { timeZone: 'Asia/Kolkata' });
                    console.log('Sending update to discord: ' + str);
                    client.channels.cache.get('864708503058251796').setTopic(str)
                        .then(newChannel => console.log(`Channel's new topic is ${newChannel.topic}`))
                        .catch(console.error);
                    if(e.connectionCount >= 1950 && !fullFlag) {
                        client.channels.cache.get('864708503058251796').send('Alert! ' + e.worldName + ' is about to be full, join now if you wanna avoid queue!');
                        fullFlag = true;
                    }
                    if(e.connectionCount <= 1750 && fullFlag) {
                        fullFlag = false;
                    }
                }
            });
        });
    }).on('error', function (e) {
        console.log("Error fetching json: ", e);
    });
}