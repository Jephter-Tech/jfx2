const fs = require('fs');
const path = require('path');

const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363420646690174@newsletter',
            newsletterName: '𝐉𝐅𝐗 𝐌𝐃-𝐗',
            serverMessageId: -1
        }
    }
};

// Path to store auto status configuration
const configPath = path.join(__dirname, '../data/autoStatus.json');

// Initialize config file if it doesn't exist
if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({ enabled: false }));
}

// 📂 Utility function to pick a random image
function getRandomImage() {
    const assetsDir = path.join(__dirname, '../assets');
    if (!fs.existsSync(assetsDir)) return null;

    const files = fs.readdirSync(assetsDir)
        .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file)); // only images

    if (files.length === 0) return null;

    const randomFile = files[Math.floor(Math.random() * files.length)];
    return path.join(assetsDir, randomFile);
}

async function autoStatusCommand(sock, chatId, msg, args) {
    try {
        // Check if sender is owner
        if (!msg.key.fromMe) {
            await sock.sendMessage(chatId, { 
                text: '❌ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴏɴʟʏ ʙᴇ ᴜꜱᴇᴅ ʙʏ ᴛʜᴇ ᴏᴡɴᴇʀ!',
                ...channelInfo
            });
            return;
        }

        // Read current config
        let config = JSON.parse(fs.readFileSync(configPath));

        // If no arguments, show current status (with random image attached)
        if (!args || args.length === 0) {
            const status = config.enabled ? 'ᴇɴᴀʙʟᴇᴅ' : 'ᴅɪꜱᴀʙʟᴇᴅ';

            const imgPath = getRandomImage();
            if (imgPath) {
                await sock.sendMessage(chatId, { 
                    image: fs.readFileSync(imgPath),
                    caption: `🔄 *ᴀᴜᴛᴏ ꜱᴛᴀᴛᴜꜱ ᴠɪᴇᴡ*\n\nᴄᴜʀʀᴇɴᴛ ꜱᴛᴀᴛᴜꜱ: ${status}\n\nᴜꜱᴇ:\n.ᴀᴜᴛᴏꜱᴛᴀᴛᴜꜱ ᴏɴ - ᴇɴᴀʙʟᴇ ᴀᴜᴛᴏ ꜱᴛᴀᴛᴜꜱ ᴠɪᴇᴡ\n.ᴀᴜᴛᴏꜱᴛᴀᴛᴜꜱ ᴏꜰꜰ - ᴅɪꜱᴀʙʟᴇ ᴀᴜᴛᴏ ꜱᴛᴀᴛᴜꜱ ᴠɪᴇᴡ`,
                    ...channelInfo
                });
            } else {
                await sock.sendMessage(chatId, { 
                    text: `🔄 *ᴀᴜᴛᴏ ꜱᴛᴀᴛᴜꜱ ᴠɪᴇᴡ*\n\nᴄᴜʀʀᴇɴᴛ ꜱᴛᴀᴛᴜꜱ: ${status}\n\n(No images found in assets/)`,
                    ...channelInfo
                });
            }
            return;
        }

        // Handle on/off commands
        const command = args[0].toLowerCase();
        if (command === 'on') {
            config.enabled = true;
            fs.writeFileSync(configPath, JSON.stringify(config));
            await sock.sendMessage(chatId, { 
                text: '✅ ᴀᴜᴛᴏ ꜱᴛᴀᴛᴜꜱ ᴠɪᴇᴡ ʜᴀꜱ ʙᴇᴇɴ ᴇɴᴀʙʟᴇᴅ!\nʙᴏᴛ ᴡɪʟʟ ɴᴏᴡ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟʏ ᴠɪᴇᴡ ᴀʟʟ ᴄᴏɴᴛᴀᴄᴛ ꜱᴛᴀᴛᴜꜱᴇꜱ.',
                ...channelInfo
            });
        } else if (command === 'off') {
            config.enabled = false;
            fs.writeFileSync(configPath, JSON.stringify(config));
            await sock.sendMessage(chatId, { 
                text: '❌ ᴀᴜᴛᴏ ꜱᴛᴀᴛᴜꜱ ᴠɪᴇᴡ ʜᴀꜱ ʙᴇᴇɴ ᴅɪꜱᴀʙʟᴇᴅ!\nʙᴏᴛ ᴡɪʟʟ ɴᴏ ʟᴏɴɢᴇʀ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟʏ ᴠɪᴇᴡ ꜱᴛᴀᴛᴜꜱᴇꜱ.',
                ...channelInfo
            });
        } else {
            await sock.sendMessage(chatId, { 
                text: '❌ ɪɴᴠᴀʟɪᴅ ᴄᴏᴍᴍᴀɴᴅ! ᴜꜱᴇ:\n.ᴀᴜᴛᴏꜱᴛᴀᴛᴜꜱ ᴏɴ - ᴇɴᴀʙʟᴇ ᴀᴜᴛᴏ ꜱᴛᴀᴛᴜꜱ ᴠɪᴇᴡ\n.ᴀᴜᴛᴏꜱᴛᴀᴛᴜꜱ ᴏꜰꜰ - ᴅɪꜱᴀʙʟᴇ ᴀᴜᴛᴏ ꜱᴛᴀᴛᴜꜱ ᴠɪᴇᴡ',
                ...channelInfo
            });
        }

    } catch (error) {
        console.error('Error in autostatus command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ ᴡʜɪʟᴇ ᴍᴀɴᴀɢɪɴɢ ᴀᴜᴛᴏ ꜱᴛᴀᴛᴜꜱ!\n' + error.message,
            ...channelInfo
        });
    }
}
