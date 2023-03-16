import { isAdmin } from "@internal/functions"
import { APIEmbed, Message } from "discord.js"
import { BetterClient, TextCommandOptions } from "../../index.js"

export default class TextCommand {
	public readonly client: BetterClient
	public readonly key: string
	private readonly adminOnly: boolean

	constructor(key: string, client: BetterClient, options: TextCommandOptions) {
		this.key = key
		this.client = client
		this.adminOnly = options.adminOnly || false
	}

	public async validate(_message: Message): Promise<APIEmbed | null> {
		if (this.adminOnly && !isAdmin(_message.author.id)) {
			return {
				title: "Missing Permissions",
				description: `This action can only be used by ${this.client.user?.username || "the bot"} Admins!`,
			}
		}

		return null
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-empty-function, @typescript-eslint/no-unused-vars
	public async run(_message: Message, _args: string[]): Promise<any> {}
}
