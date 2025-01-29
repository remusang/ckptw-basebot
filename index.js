require("./config.js")
const {
  Client,
  CommandHandler,
  Events,
  MessageType
} = require("@mengkodingan/ckptw");
const axios = require('axios');
const util = require("util");
const fs = require("fs");
const chalk = require('./lib/color');
const {
  exec
} = require("child_process");
const {
  Colors,
  Consolefy
} = require("@mengkodingan/consolefy");
const consolefy = new Consolefy();

const bot = new Client({
  WAVersion: [2, 3000, 1015901307],
  autoMention: global.autoMention,
  markOnlineOnConnect: global.markOnlineOnConnect,
  phoneNumber: global.owner,
  prefix: global.prefix,
  readIncommingMsg: global.autoRead,
  printQRInTerminal: !true,
  selfReply: true,
  usePairingCode: true
});

const sendFooter = async (ctx, message) => {
  await ctx.replyInteractiveMessage({
    body: null,
    footer: message,
    nativeFlowMessage: null
  });
}

bot.ev.once(Events.ClientReady, (m) => {
  consolefy.info(`ready at ${m.user.id.split(/[:@]/)[0]}`);
});

bot.ev.on(Events.MessagesUpsert, async (m, ctx) => {
  const string = (typeof m.text === 'string') ? m.text : m.content || '';
  const isCmd = string.startsWith("#")
  const senderJid = ctx.sender.jid;
  const senderId = senderJid.split(/[:@]/)[0];

  if (isCmd) {
    const gc = await ctx.group(ctx.id).metadata() || ctx.group(ctx.id).metadata()
    console.log(chalk.black(chalk.bgBlue(string || m.mtype)) + chalk.magenta(' From'), chalk.green(ctx.sender.pushName), chalk.yellow(ctx.sender.decodedJid.split("@")[0]) + chalk.blueBright(' In'), chalk.green(ctx.id.includes("@g.us") ? gc.subject : 'Private Chat', ctx.id));
  }
})

bot.command('ping', async (ctx) => ctx.reply({
  text: 'pong!'
}));

/** Example:
bot.command('hi', async (ctx) => {
  ctx.reply("Hello!!")
  // or
  sendFooter(ctx, "Hello!!")
})
**/

// dont change
bot.command(">", async (ctx) => {
  const senderJid = ctx.sender.jid;
  const senderId = senderJid.split(/[:@]/)[0];
  const isOwner = global.owner === senderId;
  if (!isOwner) return
  const code = ctx.args.join(" ") || null
  try {
    const result = await eval(`(async () => { ${code} })()`);
    await sendFooter(ctx, util.inspect(result));
  } catch (error) {
    console.error(`Error: ${error}`);
    await sendFooter(ctx, error.message);
  }
});

bot.command("$", async (ctx) => {
  const senderJid = ctx.sender.jid;
  const senderId = senderJid.split(/[:@]/)[0];
  const isOwner = global.owner === senderId;
  if (!isOwner) return
  const code = ctx.args.join(" ") || null
  try {
    const output = await util.promisify(exec)(code);
    await sendFooter(ctx, output.stdout || output.stderr)
  } catch (error) {
    console.error(`Error: ${error}`);
    await sendFooter(ctx, error.message)
  }
});
bot.launch();