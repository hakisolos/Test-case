const { command, isPrivate } = require("../lib/");
command(
  {
    pattern: "owner",
    fromMe: isPrivate,
    desc: "developer vcard",
    type: "user",
  },
  async (message, match, m, client) => {
  const zeta = {
  'contacts': {
    'displayName': "haki",
    'contacts': [{
      'vcard': "BEGIN:VCARD\nVERSION:3.0\nFN:KING-HAKI\nORG:Eypz\nTEL;type=CELL;type=VOICE;waid=2349112171078:2349112171078\nEND:VCARD"
    }]
  },
  'contextInfo': {
    'externalAdReply': {
      'title': "𝚗𝚒𝚔𝚔𝚊 𝚖𝚍",
      'body': "𝚑𝚊𝚔𝚒",
      'thumbnailUrl': "https://files.catbox.moe/chuyhf.jpeg",
      'mediaType': 0x1,
      'mediaUrl': "http://wa.me/2349112171078",
      'sourceUrl': "http://wa.me/2349112171078",
      'showAdAttribution': false
    }
  }
};
message.client.sendMessage(message.jid, zeta, {
  quoted: message
});
}
);


command(
  {
    pattern: "babe",
    fromMe: isPrivate,
    desc: "developer vcard",
    type: "user",
  },
  async (message, match, m, client) => {
  const zeta = {
  'contacts': {
    'displayName': "Fawzy",
    'contacts': [{
      'vcard': "BEGIN:VCARD\nVERSION:3.0\nFN:FAWZY\nORG:Eypz\nTEL;type=CELL;type=VOICE;waid=2348127980925:2348127980925\nEND:VCARD"
    }]
  },
  'contextInfo': {
    'externalAdReply': {
      'title': "hakis wife",
      'body': "nikka",
      'thumbnailUrl': "https://files.catbox.moe/chuyhf.jpeg",
      'mediaType': 0x1,
      'mediaUrl': "http://wa.me/2348127980925",
      'sourceUrl': "http://wa.me/2348127980925",
      'showAdAttribution': false
    }
  }
};
message.client.sendMessage(message.jid, zeta, {
  quoted: message
});
}
);
// +2348127980925
