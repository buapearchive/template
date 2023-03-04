import { getGuildSettings } from "@internal/database"
import { setXp } from "@internal/leveling"
import { EventHandler } from "@internal/lib"
import { logger } from "@internal/logger"
import { GuildBan } from "discord.js"

export default class GuildBanAdd extends EventHandler {
	override async run(ban: GuildBan) {
		const guildSettings = await getGuildSettings(ban.guild.id)

		if (guildSettings.resetXpOnBan) {
			await setXp(ban.user.id, ban.guild.id, 0).catch((error) => logger.thrownError(error))
		}
	}
}
