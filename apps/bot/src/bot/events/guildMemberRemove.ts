import { getGuildSettings } from "@internal/database"
import { setXp } from "@internal/leveling"
import { EventHandler } from "@internal/lib"
import { logger } from "@internal/logger"
import { GuildMember } from "discord.js"

export default class GuildMemberRemove extends EventHandler {
	override async run(member: GuildMember) {
		const guildSettings = await getGuildSettings(member.guild.id)

		if (guildSettings.resetXpOnLeave) {
			await setXp(member.id, member.guild.id, 0).catch((error) => logger.thrownError(error))
		}
	}
}
