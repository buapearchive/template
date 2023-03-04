import { resolve } from "path"
import { Client, ClientOptions, Collection, Locale, Snowflake } from "discord.js"
import { getFiles, uploadHaste } from "@internal/functions"
import { logger } from "@internal/logger"
import {
	ApplicationCommand,
	ApplicationCommandHandler,
	AutoCompleteHandler,
	Button,
	ButtonHandler,
	Debugger,
	Dropdown,
	DropdownHandler,
	EventHandler,
	ModalSubmit,
	ModalSubmitHandler,
	TextCommand,
	TextCommandHandler,
} from "../.."

export default class BetterClient extends Client {
	public usersUsingBot: Set<string>
	public readonly applicationCommandHandler: ApplicationCommandHandler
	public applicationCommands: Collection<string, ApplicationCommand>
	public readonly textCommandHandler: TextCommandHandler
	public textCommands: Collection<string, TextCommand>
	public readonly buttonHandler: ButtonHandler
	public buttons: Collection<string, Button>
	public readonly dropdownHandler: DropdownHandler
	public dropdowns: Collection<string, Dropdown>
	public readonly autoCompleteHandler: AutoCompleteHandler
	public readonly modalSubmitHandler: ModalSubmitHandler
	public modals: Collection<string, ModalSubmit>
	public events: Map<string, EventHandler>
	public hasteStore: Collection<string, string[]>
	public sudo: Collection<Snowflake, Snowflake> = new Collection()
	public localeCache: Collection<Snowflake, Locale> = new Collection()
	public userChannelCache: Collection<`${Snowflake}-${Snowflake}`, Snowflake>
	public debugger: Debugger

	/**
	 * __dirname is not in our version of ECMA, so we make do with a shitty fix.
	 */
	public readonly __dirname: string

	/**
	 * Create our client.
	 * @param options - The options for our client.
	 */
	constructor(options: ClientOptions) {
		super(options)

		this.__dirname = `${resolve()}/dist`

		this.usersUsingBot = new Set()
		this.debugger = new Debugger(this)

		this.applicationCommandHandler = new ApplicationCommandHandler(this)
		this.applicationCommands = new Collection()
		this.autoCompleteHandler = new AutoCompleteHandler(this)

		this.textCommandHandler = new TextCommandHandler(this)
		this.textCommands = new Collection()

		this.buttonHandler = new ButtonHandler(this)
		this.buttons = new Collection()

		this.dropdownHandler = new DropdownHandler(this)
		this.dropdowns = new Collection()

		this.modalSubmitHandler = new ModalSubmitHandler(this)
		this.modals = new Collection()

		this.events = new Map()

		this.hasteStore = new Collection()
		this.localeCache = new Collection()
		this.userChannelCache = new Collection()

		this.dropdownHandler.loadFiles()
		this.buttonHandler.loadFiles()
		this.applicationCommandHandler.loadFiles()
		this.textCommandHandler.loadFiles()
		this.modalSubmitHandler.loadModals()
		this.loadEvents()
	}

	/**
	 * Load all the events in the events directory.
	 */
	private loadEvents() {
		try {
			getFiles(`${this.__dirname}/src/bot/events`, "js", true).forEach(async (eventFileName) => {
				const eventFile = await import(`${this.__dirname}/src/bot/events/${eventFileName}`)
				// eslint-disable-next-line new-cap
				const event: EventHandler = new eventFile.default(this, eventFileName.split(".")[0])
				event.listen()
				return this.events.set(event.name, event)
			})
		} catch (e) {
			logger.warn(`Failed to load files for events handler`)
		}
	}

	/**
	 * Reload all the events in the events directory.
	 */
	public reloadEvents() {
		this.events.forEach((event) => event.removeListener())
		this.loadEvents()
	}

	public hasteLog(id: string, text: string) {
		const data = this.hasteStore.get(id) || []
		data.push(`${text}\n`)
		this.hasteStore.set(id, data)
	}

	public async hasteFlush(id: string, url?: string) {
		const raw = this.hasteStore.get(id) || []
		const final = raw.join("\n")
		if (url) {
			const data = await uploadHaste(final, "md", url)
			return data
		}
		const data = await uploadHaste(final, "md")
		return data
	}
}
