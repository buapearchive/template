import { GatewayIntentBits, PermissionsBitField, PermissionFlagsBits } from "discord.js"

const botName = "Kiai"
const admins = ["439223656200273932"]

const colors = {
	primary: 0xd8833b,
	success: 0x57f287,
	warning: 0xfee75c,
	error: 0xed4245,
	invisible: 0x2f3136,
}

const intents = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildWebhooks,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessageReactions,
]

const requiredPermissions = new PermissionsBitField([
	PermissionFlagsBits.EmbedLinks,
	PermissionFlagsBits.SendMessages,
	PermissionFlagsBits.UseExternalEmojis,
])

const embedSpacer = "https://cdn.animeinterlink.com/r/embed_spacer.png"
const emojiSpacer = "<:spacer:991733061182038178>"

export * from "./settings"

export { botName, admins, colors, intents, requiredPermissions, embedSpacer, emojiSpacer }
