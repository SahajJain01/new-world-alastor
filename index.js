const Discord = require("discord.js");
const https = require('https');
// const express = require('express');
// const app = express();
// const port = 3000;

var url = 'https://nwdb.info/server-status/data.json';

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// client.on('interactionCreate', async interaction => {
//   if (!interaction.isCommand()) return;

//   if (interaction.commandName === 'ping') {
//     await interaction.reply('Pong!');
//   }
// });

client.login('ODEyMjI0MjU0OTIxNDA4NTI1.YC9oyA.o5TMzTeEoNTMDt7oLn5LlRR3gFI');

// app.get('/', function (req, r) {
//     https.get(url, function (res) {
//         var body = '';
//         res.on('data', function (chunk) {
//             body += chunk;
//         });
//         res.on('end', function () {
//             var data = JSON.parse(body);
//             data.data.servers.forEach(e => {
//                 if (e.worldName == req.query.worldName) {
//                     r.send(e);
//                     client.channels.cache.get('864708503058251796').setTopic('Testing')
//                         .then(newChannel => console.log(`Channel's new topic is ${newChannel.topic}`))
//                         .catch(console.error);
//                 }
//             });
//         });
//     }).on('error', function (e) {
//         console.log("Error fetching json: ", e);
//     });

// });
// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
// })

setInterval(function(){ 
    https.get(url, function (res) {
        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            var data = JSON.parse(body);
            data.data.servers.forEach(e => {
                if (e.worldName == 'Alastor') {
                    var st;
                    if(e.status == 8) {
                        st = 'Online';
                    } else {
                        st = 'Offline';
                    }
                    client.channels.cache.get('864708503058251796').setTopic
                        (e.worldName + ' - ' + e.connectionCount + '/' + e.connectionCountMax + ', Queue: ' + e.queueCount + ', Queue Time: ' + e.queueTime + 's' + ', Status: ' + st + ', StatusCode: ' + e.status)
                            .then(newChannel => console.log(`Channel's new topic is ${newChannel.topic}`))
                            .catch(console.error);
                }
            });
        });
    }).on('error', function (e) {
        console.log("Error fetching json: ", e);
    });
 }, 60000);