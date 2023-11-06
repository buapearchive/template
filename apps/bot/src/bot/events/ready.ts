import path from "path"
import { getFiles } from "@buape/functions"
import { BetterClient, EventHandler } from "@buape/lib"
import database from "@internal/database"
import { logger } from "@internal/logger"

export default class Ready extends EventHandler {
	override async run() {
		await this.client.application?.fetch()
		const allGuilds = await this.client.shard?.broadcastEval(async (c) =>
			c.guilds.cache.map(
				(guild) => `${guild.name} [${guild.id}] - ${guild.memberCount} members.`
			)
		)
		if (!allGuilds) return
		const guildsStringList: string[] = []
		for (let i = 0; i < allGuilds.length; i++) {
			guildsStringList.push(`Shard ${i + 1}\n${allGuilds[i].join("\n")}`)
		}
		// const stats = await this.client.fetchStats()
		logger.info(
			`Logged in as ${this.client.user?.tag} [${this.client.user?.id}]`
		) // with ${stats.guilds} guilds and ${stats.users} users.`)

		loadAndStartCrons(this.client)

		if (process.env.NODE_ENV === "development") {
			for (const guild of this.client.guilds.cache.values()) {
				await database.guild.upsert({
					where: {
						id: guild.id
					},
					update: {
						name: guild.name
					},
					create: {
						id: guild.id,
						name: guild.name
					}
				})
			}
		}
	}
}

async function loadAndStartCrons(client: BetterClient) {
	try {
		const cronJobsPath = path.join(client.__dirname, "src", "bot", "jobs")
		const cronJobFileNames = getFiles(cronJobsPath, "js", true)

		await Promise.all(
			cronJobFileNames.map(async (cronJobFileName) => {
				try {
					const filePath = path.join(cronJobsPath, cronJobFileName)
					const fileUrl = `file://${filePath.replace(/\\/g, "/")}`

					const { startCron } = await import(fileUrl)
					startCron(client)
					logger.info(`[CRON] Loaded cron job ${cronJobFileName}`)
				} catch (error) {
					logger.error(
						`[CRON] Failed to load cron job: ${cronJobFileName} - ${error}`
					)
				}
			})
		)
	} catch (e) {
		logger.warn(`[CRON] Failed to load files for cron job handler: ${e}`)
	}
}
