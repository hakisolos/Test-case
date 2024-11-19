const {
  default: makeWASocket,
  useMultiFileAuthState,
  Browsers,
  makeInMemoryStore,
} = require("@whiskeysockets/baileys");
const fs = require("fs");
const { serialize } = require("./lib/serialize");
const { Message } = require("./lib/Base");
const pino = require("pino");
const path = require("path");
const events = require("./lib/event");
const got = require("got");
const config = require("./config");
const { PluginDB } = require("./lib/database/plugins");
const Greetings = require("./lib/Greetings");
const saveCreds = require("./lib/session");

const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});

require("events").EventEmitter.defaultMaxListeners = 50;

const { File } = require("megajs");

(async function () {
  var prefix = "Nikka-X";
  var output = "./lib/session/";
  var pth = output + "creds.json";

  try {
    var store = makeInMemoryStore({
      logger: pino().child({ level: "silent", stream: "store" }),
    });

    require("events").EventEmitter.defaultMaxListeners = 50;

    if (!fs.existsSync(pth)) {
      if (!config.SESSION_ID.startsWith(prefix)) {
        throw new Error("Invalid session id.");
      }

      var url = "https://mega.nz/file/" + config.SESSION_ID.replace(prefix, "");
      var file = File.fromURL(url);
      await file.loadAttributes();

      if (!fs.existsSync(output)) {
        fs.mkdirSync(output, { recursive: true });
      }

      var data = await file.downloadBuffer();
      fs.writeFileSync(pth, data);
    }
  } catch (error) {
    console.error(error);
  }
})();

fs.readdirSync("./lib/database/").forEach((plugin) => {
  if (path.extname(plugin).toLowerCase() === ".js") {
    require("./lib/database/" + plugin);
  }
});

async function Abhiy() {
  console.log("Syncing Database");
  await config.DATABASE.sync();

  const { state, saveCreds } = await useMultiFileAuthState(
    "./lib/session",
    pino({ level: "silent" })
  );

  let conn = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state,
    printQRInTerminal: true,
    browser: Browsers.macOS("Desktop"),
    downloadHistory: false,
    syncFullHistory: false,
  });

  store.bind(conn.ev);

  setInterval(() => {
    store.writeToFile("./lib/store_db.json");
    console.log("saved store");
  }, 30 * 60 * 1000);

  conn.ev.on("connection.update", async (s) => {
    const { connection, lastDisconnect } = s;

    if (connection === "connecting") {
      console.log("ɴɪᴋᴋᴀ");
      console.log("ᴘʀᴏᴄᴇssɪɴɢ sᴇssɪᴏɴ ɪᴅ");
    }

    if (
      connection === "close" &&
      lastDisconnect &&
      lastDisconnect.error &&
      lastDisconnect.error.output.statusCode !== 401
    ) {
      if (conn?.state?.connection !== "open") {
        console.log(lastDisconnect.error.output.payload);
        Abhiy();
      }
    }

    if (connection === "open") {
      console.log("ʟᴏɢɪɴ sᴜᴄᴄᴇssғᴜʟ ✅");
      console.log("ɪɴsᴛᴀʟʟɪɴɢ ᴘʟᴜɢɪɴs 📥");

      let plugins = await PluginDB.findAll();
      plugins.map(async (plugin) => {
        if (!fs.existsSync("./plugins/" + plugin.dataValues.name + ".js")) {
          console.log(plugin.dataValues.name);
          var response = await got(plugin.dataValues.url);
          if (response.statusCode === 200) {
            fs.writeFileSync(
              "./plugins/" + plugin.dataValues.name + ".js",
              response.body
            );
            require("./plugins/" + plugin.dataValues.name + ".js");
          }
        }
      });
      console.log("ᴘʟᴜɢɪɴs ɪɴsᴛᴀʟʟᴇᴅ ✅");

      fs.readdirSync("./plugins").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() === ".js") {
          require("./plugins/" + plugin);
        }
      });

      console.log("ɴɪᴋᴋᴀ x ᴍᴅ ᴄᴏɴɴᴇᴄᴛᴇᴅ ✅");

      const packageVersion = require("./package.json").version;
      const totalPlugins = events.commands.length;
      const workType = config.WORK_TYPE;
      const statusMessage = `ɴɪᴋᴋᴀ x ᴍᴅ ᴄᴏɴɴᴇᴄᴛᴇᴅ  ✅\nᴠᴇʀsɪᴏɴ: ${packageVersion}\nᴄᴍᴅs: ${totalPlugins}\ᴡᴏʀᴋᴛʏᴘᴇ: ${workType}\n 𝗺𝗮𝗱𝗲 𝘄𝗶𝘁𝗵 ❤️ 𝗯𝘆 𝗵𝗮𝗸𝗶`;

      await conn.sendMessage(conn.user.id, {
        image: { url: "https://files.catbox.moe/mnp025.jpg" },
        caption: `\`\`\`${statusMessage}\`\`\``,
      });
    }

    try {
      conn.ev.on("creds.update", saveCreds);

conn.ev.on("group-participants.update", async (data) => {
  // When a new member joins the group
  if (data.action === 'add') {
    const groupMetadata = await conn.groupMetadata(data.id);
    const groupName = groupMetadata.subject;
    const newMember = data.participants[0];
    
    // Send a welcome message with a thumbnail
    await conn.sendMessage(
      data.id,
      {
        text: `Welcome to *${groupName}*, @${newMember.split('@')[0]}! 🎉`,
        mentions: [newMember],
        contextInfo: {
          externalAdReply: {
            title: "ʜᴇʏ ᴘᴏᴏᴋɪᴇ",
            body: "We hope you have a great time here.",
            sourceUrl: "",
            mediaUrl: "",
            mediaType: 1,
            showAdAttribution: true,
            renderLargerThumbnail: false,
            thumbnailUrl: "https://files.catbox.moe/mnp025.jpg",  // Add the thumbnail URL here
          },
        },
      }
    );
  }

  // When a member leaves the group
  if (data.action === 'remove') {
    const groupMetadata = await conn.groupMetadata(data.id);
    const groupName = groupMetadata.subject;
    const leavingMember = data.participants[0];
    
    // Send a goodbye message with a thumbnail
    await conn.sendMessage(
      data.id,
      {
        text: `Goodbye, @${leavingMember.split('@')[0]}! 😢 You will not be missed from *${groupName}*.`,
        mentions: [leavingMember],
        contextInfo: {
          externalAdReply: {
            title: "Sorry to See You Go!",
            body: "We hope to see you again.",
            sourceUrl: "",
            mediaUrl: "",
            mediaType: 1,
            showAdAttribution: true,
            renderLargerThumbnail: false,
            thumbnailUrl: "https://files.catbox.moe/mnp025.jpg",  // Add the thumbnail URL here
          },
        },
      }
    );
  }
});

conn.ev.removeAllListeners("messages.upsert");
conn.ev.on("messages.upsert", async (m) => {
  if (m.type !== "notify") return;
  let ms = m.messages[0];
  let msg = await serialize(JSON.parse(JSON.stringify(ms)), conn);

  if (!msg.message) return;

  let text_msg = msg.body;
  if (text_msg && config.LOGS) {
    console.log(
      `At : ${
        msg.from.endsWith("@g.us")
          ? (await conn.groupMetadata(msg.from)).subject
          : msg.from
      }\nFrom : ${msg.sender}\nMessage:${text_msg}`
    );
  }

  events.commands.map(async (command) => {
    if (
      command.fromMe &&
      !config.SUDO?.split(",").includes(
        msg.sender?.split("@")[0] || !msg.isSelf
      )
    )
      return;

    let comman;
    if (text_msg) {
      comman = text_msg.trim().split(/ +/)[0];
      msg.prefix = new RegExp(config.HANDLERS).test(text_msg)
        ? text_msg.split("").shift()
        : ",";
    }

    if (command.pattern && command.pattern.test(comman)) {
      var match;
      try {
        match = text_msg.replace(new RegExp(comman, "i"), "").trim();
      } catch {
        match = false;
      }

      whats = new Message(conn, msg, ms);
      command.function(whats, match, msg, conn);
    } else if (text_msg && command.on === "text") {
      whats = new Message(conn, msg, ms);
      command.function(whats, text_msg, msg, conn, m);
    }
  });
});

process.on("uncaughtException", async (err) => {
  let error = err.message;
  console.log(err);
  await conn.sendMessage(conn.user.id, { text: error });
});

setTimeout(() => {
  Abhiy();
}, 3000);
