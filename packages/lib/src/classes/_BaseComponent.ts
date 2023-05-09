import { BetterClient, BaseComponentOptions } from "../../index.js"
import { APIEmbed, BaseInteraction, PermissionsBitField } from "discord.js"
import { logger } from "@internal/logger"
import { getPermissionName, isAdmin } from "@internal/functions"

export default class BaseComponent {
	public readonly client: BetterClient
	public readonly key: string
	public readonly permissions?: PermissionsBitField
	private readonly clientPermissions?: PermissionsBitField
	private readonly adminOnly: boolean
	private readonly guildOnly: boolean
	private readonly ownerOnly: boolean
	public readonly cooldown: number
	public readonly authorOnly: boolean

	constructor(key: string, client: BetterClient, options: BaseComponentOptions) {
		this.key = key
		this.client = client
		if (options.permissions) this.permissions = options.permissions
		if (options.clientPermissions) this.clientPermissions = options.clientPermissions
		this.adminOnly = options.adminOnly || false
		this.guildOnly = options.guildOnly || false
		this.ownerOnly = options.ownerOnly || false
		this.cooldown = options.cooldown || 0
		this.authorOnly = options.authorOnly || false
	}

	public async validate(interaction: BaseInteraction): Promise<APIEmbed | null> {
		if (this.guildOnly && !interaction.guild) {
			return {
				title: "Missing Permissions",
				description: "This action can only be used in guilds!",
			}
		}

		await interaction.guild?.fetch()

		if (interaction.guildId) {
			if (this.ownerOnly && interaction.guild?.ownerId !== interaction.user.id) {
				return {
					title: "Missing Permissions",
					description: "This action can only be ran by the owner of this guild!",
				}
			}
			if (this.permissions && !interaction.memberPermissions?.has(this.permissions)) {
				return {
					title: "Missing Permissions",
					description: `You need the ${this.permissions
						.toArray()
						.map((permission) => `**${getPermissionName(permission)}**`)
						.join(", ")} permission${this.permissions.toArray().length > 1 ? "s" : ""} to run this action.`,
				}
			}
			if (this.clientPermissions && !interaction.guild?.members.me?.permissions.has(this.clientPermissions)) {
				return {
					title: "Missing Permissions",
					description: `I need the ${this.clientPermissions
						.toArray()
						.map((permission) => `**${getPermissionName(permission)}**`)
						.join(", ")} permission${this.clientPermissions.toArray().length > 1 ? "s" : ""} to run this action.`,
				}
			}
		}

		if (this.adminOnly && !isAdmin(interaction.user.id)) {
			return {
				title: "Missing Permissions",
				description: `This action can only be used by ${this.client.user?.username || "the bot"} Admins!`,
			}
		}

		const specifics = await this.specificValidate(interaction)
		if (specifics) return specifics
		return null
	}

	public async specificValidate(_interaction: BaseInteraction): Promise<APIEmbed | null> {
		return null
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-empty-function
	public async run(interaction: BaseInteraction): Promise<any> {
		logger.null(interaction)
		throw new Error("Not implemented")
	}
}
