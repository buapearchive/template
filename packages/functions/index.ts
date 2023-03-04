export * from "./src/generateMessage"
export * from "./src/generateTimestamp"
export * from "./src/getFiles"
export * from "./src/getPermissionName"
export * from "./src/isAdmin"
export * from "./src/parseUser"
export * from "./src/randomInt"
export * from "./src/titleCase"
export * from "./src/uploadHaste"

import { APIEmbed, ActionRowBuilder, ButtonBuilder } from "discord.js"

export interface GeneratedMessage {
	embeds?: APIEmbed[]
	components?: ActionRowBuilder<ButtonBuilder>[]
	ephemeral?: boolean
	content?: string
}
