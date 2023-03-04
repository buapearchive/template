import { Message } from "discord.js"
import { EventHandler } from "@internal/lib"
import { addXpFromMessage } from "@internal/leveling"

export default class MessageCreate extends EventHandler {
	override async run(message: Message) {
		if (message.guild && message.member) {
			this.client.userChannelCache.set(`${message.guild.id}-${message.author.id}`, message.channel.id)
			addXpFromMessage(message.member, message.guild.id, message)
		}

		this.client.textCommandHandler.handle(message)
	}
}
