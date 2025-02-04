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
const utils = require("./lib/utils");
const FileType = require('file-type')
const FormData = require("form-data")
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

bot.command('on', async (ctx) => sendFooter(ctx, {
	text: 'bot online!'
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

bot.launch().catch((error) => consolefy.error(`Error: ${error}`));