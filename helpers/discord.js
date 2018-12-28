const config = require('../config')
const { Client, Attachment } = require("discord.js");
const client = new Client();
let isReady = false
client.on('error', function(d) {
    console.log(d.responsee, 'discord client err')
})
client.on('ready', function(d) {
    isReady = true
})
// client.user.setGame(`on helping MOEIN`);
function sendMessage(text = 'no text') {
    text = String(text)
    return new Promise((resolve, reject) => {
        if (isReady) {
            let message = client.channels.get(config.discordChannel)
            message.send(text)
                .then(a => {
                    resolve({ success: true })
                }).catch(e => {
                    reject(e)
                })
        }
    })
}

function sendPhoto(text = 'eqeq', photo) {
    text = String(text)
    console.log(photo, 'send photo')
    return new Promise((resolve, reject) => {
        const attachment = new Attachment(photo.url);
        let message = client.channels.get(config.discordChannel)
        message.send(text, attachment)
            .then(a => {
                console.log(a, 'success')
                resolve({ success: true })
            }).catch(e => {
                console.log(e, 'err')
                reject(e)
            })

    })
}

function sendVideo(text = 'eqeq', video) {
    console.log(video, 'discord sendvideo')
    text = String(text)
    return new Promise((resolve, reject) => {

        let message = client.channels.get(config.discordChannel)
        const attachment = new Attachment(video.url);
        message.send(text, attachment)
            .then(a => {
                console.log(a, 'success')
                resolve({ success: true })
            }).catch(e => {
                console.log(e, 'discord sendVideo err')
                reject(e)
            })

    })
}



client.login(config.discord).then(a => {
    console.log(a, 'discord client login')
}).catch(e => {
    console.log(e, 'discord login err')
});
module.exports = {
    sendMessage: sendMessage,
    sendPhoto: sendPhoto,
    sendVideo: sendVideo,
}
