import { BetterClient, TextCommand } from "../../index.js"
import { Message } from "discord.js"
import { generateErrorMessage, getFiles } from "@internal/functions"
import { logger } from "@internal/logger"

export default class TextCommandHandler {
	public client: BetterClient

	constructor(client: BetterClient) {
		this.client = client
	}

	public loadFiles() {
		try {
			getFiles(`${this.client.__dirname}/src/bot/textCommands`, "", true).forEach((parentFolder) => {
				getFiles(`${this.client.__dirname}/src/bot/textCommands/${parentFolder}`, "js").forEach(async (fileName) => {
					const file = await import(`${this.client.__dirname}/src/bot/textCommands/${parentFolder}/${fileName}`)
					// eslint-disable-next-line new-cap
					const component = new file.default(this.client)
					return this.client.textCommands.set(component.key, component)
				})
			})
		} catch (e) {
			logger.warn(`Failed to load files for textCommands handler`)
		}
	}

	public reloadFiles() {
		this.client.textCommands.clear()
		this.loadFiles()
	}

	public fetchCommand(key: string) {
		return this.client.textCommands.get(key) || undefined
	}

	public async handle(message: Message) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const prefix = `<@${this.client.user!.id}> `
		if (!prefix || !message.content.startsWith(prefix)) return
		const args = message.content.slice(prefix.length).trim().split(/ +/g)
		const commandName = args.shift()?.toLowerCase()
		const command = this.fetchCommand(commandName || "")
		if (!command) return

		const missingPermissions = await command.validate(message)
		if (missingPermissions) return message.reply(generateErrorMessage(missingPermissions))

		return this.runCommand(command, message, args)
	}

	private async runCommand(command: TextCommand, message: Message, args: string[]) {
		this.client.usersUsingBot.add(message.author.id)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await command.run(message, args).catch(async (error: any): Promise<any> => {
			logger.thrownError(error)
			return message.reply(
				generateErrorMessage({
					title: "An Error Has Occurred",
					description: `An unexpected error was encountered while running \`${command.key}\`, my developers have already been notified! Feel free to join my support server in the mean time!`,
				})
			)
		})
		this.client.usersUsingBot.delete(message.author.id)
	}
}
