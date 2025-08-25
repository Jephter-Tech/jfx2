const fs = require('fs');
const os = require('os');
const path = require('path');
const settings = require('../settings.js');
const { sizeFormatter } = require('human-readable');

const format = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
});

// ⏱ Format uptime
function formatTime(seconds) {
  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds %= 24 * 60 * 60;
  const hours = Math.floor(seconds / (60 * 60));
  seconds %= 60 * 60;
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);

  let time = '';
  if (days > 0) time += `${days}d `;
  if (hours > 0) time += `${hours}h `;
  if (minutes > 0) time += `${minutes}m `;
  if (seconds > 0 || time === '') time += `${seconds}s`;

  return time.trim();
}

async function pingCommand(sock, chatId, message) {
  try {
    // Newsletter forwarding info
    const channelInfo = {
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363420646690174@newsletter", // your channel JID
          newsletterName: "𝐉𝐅𝐗 𝐌𝐃-𝐗",
          serverMessageId: -1
        }
      }
    };

    const start = Date.now();
    await sock.sendMessage(chatId, { text: 'Pong!', ...channelInfo }, { quoted: message });
    const end = Date.now();
    const ping = Math.round((end - start) / 2);

    const uptimeFormatted = formatTime(process.uptime());
    const memoryUsage = process.memoryUsage();

    const cpuModel = os.cpus()[0]?.model || 'Unknown CPU';
    const cpuSpeed = os.cpus()[0]?.speed || 0;
    const totalMem = format(os.totalmem());
    const freeMem = format(os.freemem());
    const usedMem = format(os.totalmem() - os.freemem());

    const memoryFormatted = Object.entries(memoryUsage)
      .map(([key, val]) => `${key}: ${format(val)}`)
      .join(', ');

    const botInfo = `
┏━━━『ᴊꜰx ᴍᴅ-xᴠ2 ᴘɪɴɢ™ 』━━━┓
✦ 🚀 Ping       : ${ping} ms
✦ ⏱️ Uptime     : ${uptimeFormatted}
✦ 🧬 Version    : v${settings.version}

💻 *ꜱʏꜱᴛᴇᴍ ꜱᴛᴀᴛꜱ*
✦ CPU         : ${cpuModel} (${cpuSpeed} MHz)
✦ RAM Usage   : ${usedMem} / ${totalMem}
✦ Free Memory : ${freeMem}
✦ Memory Info : ${memoryFormatted}
┗━━━━━━━━━━━━━━━┛`.trim();

    // 🖼 Send image with caption (forwarded)
    const imageBuffer = fs.readFileSync(path.join(__dirname, '../assets/ping.jpg'));
    await sock.sendMessage(chatId, {
      image: imageBuffer,
      caption: botInfo,
      ...channelInfo
    }, { quoted: message });

    // 🔊 Send audio response (forwarded)
    const audioBuffer = fs.readFileSync('./audio/ping.mp3');
    await sock.sendMessage(chatId, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg',
      ptt: true,
      ...channelInfo
    }, { quoted: message });

  } catch (error) {
    console.error('Error in ping command:', error);
    await sock.sendMessage(chatId, { 
      text: '❌ Failed to get bot status.',
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363420646690174@newsletter",
          newsletterName: "ᴊꜰx ᴍᴅ-xᴠ2",
          serverMessageId: -1
        }
      }
    }, { quoted: message });
  }
}

module.exports = pingCommand;
