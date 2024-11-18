const {
  command,
  isPrivate,
  getBuffer
} = require("../lib/");

let images = [
  "https://files.catbox.moe/fgq7tm.jpg",
  "https://files.catbox.moe/7bgscf.jpg",
  "https://files.catbox.moe/qxtquy.jpg",
  "https://files.catbox.moe/fgq7tm.jpg",
  "https://files.catbox.moe/ytdlgz.jpg"
];

command({
  pattern: "muzan ?(.*)",
  fromMe: isPrivate,
  desc: "Send a random image",
  type: "user"
}, async (message, match, m, client) => {
  try {
    let img = images[Math.floor(Math.random() * images.length)]; // Select a random image
    let buff = await getBuffer(img); // Fetch the image as a buffer
    await message.client.sendMessage(message.jid, {
      'image': buff,
      'mimetype': "image/jpeg",
      'caption': "\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʜᴀᴋɪ",
      'contextInfo': {
        'externalAdReply': {
          'title': " 𝗠𝗨𝗭𝗔𝗡 𝗞𝗜𝗕𝗨𝗧𝗦𝗨𝗝𝗜",
          'body': "𝗡𝗶𝗸𝗸𝗮 𝗺𝗱",
          'sourceUrl': "",
          'mediaUrl': "",
          'mediaType': 1,
          'showAdAttribution': true,
          'renderLargerThumbnail': false,
          'thumbnailUrl': "https://files.catbox.moe/8s6w29.jpg"
        }
      }
    });
  } catch (error) {
    return message.reply(error);
  }
});