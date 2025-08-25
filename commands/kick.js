const isAdmin = require('../lib/isAdmin');

async function kickCommand(sock, chatId, senderId, mentionedJids, message) {
    // Check if user is owner
    const isOwner = message.key.fromMe;
    if (!isOwner) {
        const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);

        if (!isBotAdmin) {
            await sock.sendMessage(
                chatId, 
                { text: '⚠️ Please make the bot an admin first.' }, 
                { quoted: message }
            );
            return;
        }

        if (!isSenderAdmin) {
            await sock.sendMessage(
                chatId, 
                { text: '🚫 Only group admins can use the kick command.' }, 
                { quoted: message }
            );
            return;
        }
    }

    let usersToKick = [];

    // ✅ Check for mentioned users
    if (mentionedJids && mentionedJids.length > 0) {
        usersToKick = mentionedJids;
    }
    // ✅ Check for replied message
    else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        usersToKick = [message.message.extendedTextMessage.contextInfo.participant];
    }

    // ❌ No user found
    if (usersToKick.length === 0) {
        await sock.sendMessage(
            chatId, 
            { text: '👉 Please mention a user or reply to their message to kick!' }, 
            { quoted: message }
        );
        return;
    }

    // Get bot's ID
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';

    // ❌ Prevent self-kick
    if (usersToKick.includes(botId)) {
        await sock.sendMessage(
            chatId, 
            { text: "🤖 I can't kick myself!" }, 
            { quoted: message }
        );
        return;
    }

    try {
        // ✅ Kick users
        await sock.groupParticipantsUpdate(chatId, usersToKick, "remove");

        // ✅ Mention kicked users
        const usernames = usersToKick.map(jid => `@${jid.split('@')[0]}`);

        await sock.sendMessage(
            chatId,
            { 
                text: `${usernames.join(', ')} ᴍᴏᴛʜᴇʀꜰᴜᴄᴋᴇʀ ʜᴀꜱ ʙᴇᴇɴ ᴋɪᴄᴋ`, 
                mentions: usersToKick 
            },
            { quoted: message }
        );
    } catch (error) {
        console.error('❌ Error in kick command:', error);
        await sock.sendMessage(
            chatId, 
            { text: '⚠️ Failed to kick user(s). Please try again!' }, 
            { quoted: message }
        );
    }
}

module.exports = kickCommand;
