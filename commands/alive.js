const fs = require('fs');
const path = require('path');
const settings = require("../settings");

async function aliveCommand(sock, chatId, message) {
    try {
        const message1 = `

> *Status:* ᴏɴʟɪɴᴇ
> *Mode:* ᴘᴜʙʟɪᴄ
> *Version:* ${settings.version}

┏━ 🌟 *Features* ━
┃ • ɢʀᴏᴜᴘ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ
┃ • ᴀɴᴛɪʟɪɴᴋ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ
┃ • ꜰᴜɴ ᴄᴏᴍᴍᴀɴᴅꜱ
┃ • ᴀɴᴅ ᴍᴏʀᴇ!
┗━━━━━━━━━━

📎 ᴛʏᴘᴇ *.menu* ꜰᴏʀ ꜰᴜʟʟ ᴄᴏᴍᴍᴀɴᴅ ʟɪꜱᴛ`;

        // 📂 Pick random image from assets folder
        const assetsDir = path.join(__dirname, '../assets');
        let files = [];
        try {
            files = fs.readdirSync(assetsDir)
                .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file)); // Only image files
        } catch (err) {
            console.error('❌ Failed to read assets folder:', err);
        }

        let imageBuffer = null;
        if (files.length > 0) {
            const randomImage = files[Math.floor(Math.random() * files.length)];
            const imagePath = path.join(assetsDir, randomImage);
            imageBuffer = fs.readFileSync(imagePath);
        }

        // Send with random image if available
        if (imageBuffer) {
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: message1,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363420646690174@newsletter',
                        newsletterName: 'ᴊꜰx ᴍᴅ-xᴠ2',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        } else {
            // Fallback to text only
            await sock.sendMessage(chatId, {
                text: message1,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363420646690174@newsletter',
                        newsletterName: 'ᴊꜰx ᴍᴅ-xᴠ2',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        }

        // 🔊 Send audio response (like your original flow)
        const audioPath = path.join(__dirname, '../audio/alive.mp3');
        if (fs.existsSync(audioPath)) {
            const audioBuffer = fs.readFileSync(audioPath);
            await sock.sendMessage(chatId, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                ptt: true
            }, { quoted: message });
        }

    } catch (error) {
        console.error('Error in alive command:', error);
        await sock.sendMessage(chatId, { text: 'Bot is alive and running!' }, { quoted: message });
    }
}

module.exports = aliveCommand;
