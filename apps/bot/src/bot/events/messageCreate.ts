import { Message } from "discord.js"
import { EventHandler } from "@internal/lib"

export default class MessageCreate extends EventHandler {
	override async run(message: Message) {
		this.client.textCommandHandler.handle(message)
	}
}
