/* eslint-disable import/order */
import ModalSubmit from "./ModalSubmit"
import { BetterClient } from "../.."
import { ComponentType, ModalSubmitInteraction } from "discord.js"
import { generateErrorMessage, getFiles } from "@internal/functions"
import { DebugType, logger } from "@internal/logger"

export default class ModalSubmitHandler {
	/**
	 * Our client.
	 */
	private readonly client: BetterClient

	/**
	 * Create our ModalSumbitHandler.
	 * @param client - Our client.
	 */
	constructor(client: BetterClient) {
		this.client = client
	}

	/**
	 * Load all the modals in the Modals directory.
	 */
	public loadModals() {
		try {
			getFiles(`${this.client.__dirname}/src/bot/modalSubmits`, "", true).forEach((parentFolder) =>
				getFiles(`${this.client.__dirname}/src/bot/modalSubmits/${parentFolder}`, "js").forEach(async (fileName) => {
					const modalFile = await import(`${this.client.__dirname}/src/bot/modalSubmits/${parentFolder}/${fileName}`)
					// eslint-disable-next-line new-cap
					const modal: ModalSubmit = new modalFile.default(this.client)
					return this.client.modals.set(modal.name, modal)
				}))
		} catch (e) {
			logger.warn(`Failed to load files for modalSubmits handler`)
		}
	}

	/**
	 * Reload all the modals in the Modals directory.
	 */
	public reloadButtBuilders() {
		this.client.modals.clear()
		this.loadModals()
	}

	/**
	 * Fetch the modal that starts with the provided customId.
	 * @param customId - The customId to search for.
	 * @returns The modal we've found.
	 */
	private fetchModal(customId: string): ModalSubmit | undefined {
		return this.client.modals.find((modal) => customId.startsWith(modal.name))
	}

	/**
	 * Handle the interaction created for this modal to make sure the user and client can execute it.
	 * @param interaction - The interaction created.
	 */
	public async handleModal(interaction: ModalSubmitInteraction) {
		const modal = this.fetchModal(interaction.customId)
		if (!modal) return

		const sudoAs = this.client.sudo.get(interaction.user.id)
		if (sudoAs) {
			const user = await this.client.users.fetch(sudoAs)
			if (!user) return interaction.reply(`Unable to sudo, user ${sudoAs} not found.`)
			logger.info(`${interaction.user.tag} [${interaction.user.id}] sudo'd as ${sudoAs}`)
			// eslint-disable-next-line no-param-reassign
			interaction.user = user
			if (interaction.guild) {
				const member = await interaction.guild.members.fetch(sudoAs)
				if (!member) return interaction.reply(`Unable to sudo, user ${sudoAs} not in this guild and this is a guild only command.`)
				// eslint-disable-next-line no-param-reassign
				interaction.member = member
			}
		}

		return this.runModal(modal, interaction)
	}

	/**
	 * Execute our modal.
	 * @param Modal - The Modal we want to execute.
	 * @param interaction - The interaction for our modal.
	 */
	private async runModal(modal: ModalSubmit, interaction: ModalSubmitInteraction) {
		const optionData = interaction.components
			// eslint-disable-next-line array-callback-return
			.map((x) => {
				const component = x.components[0]
				if (component.type === ComponentType.TextInput) {
					return `${component.customId}: ${component.value}`
				}
			})
			.join("\n")
		logger.debug(
			`${interaction.user.tag} [${interaction.user.id}] submitted the Modal ${modal.name}\n\`\`\`${optionData}\`\`\``,
			DebugType.COMMAND
		)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		modal.run(interaction).catch(async (error: any): Promise<any> => {
			logger.thrownError(error)
			const toSend = generateErrorMessage(
				{
					title: "An Error Has Occurred",
					description: `An unexpected error was encountered while submitting, my developers have already been notified! Feel free to join my support server in the mean time!`,
					// footer: { text: `Sentry Event ID: ${sentryId} ` },
				},
				true
			)
			if (interaction.replied) return interaction.followUp(toSend)
			return interaction.reply({
				...toSend,
			})
		})
	}
}
