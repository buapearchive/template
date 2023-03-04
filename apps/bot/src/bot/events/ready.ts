import database from "@internal/database"
import { getFiles } from "@internal/functions"
import { BetterClient, EventHandler } from "@internal/lib"
import { logger } from "@internal/logger"
import { join } from "path"

export default class Ready extends EventHandler {
	override async run() {
		await this.client.application?.fetch()
		const allGuilds = await this.client.shard?.broadcastEval(async (c) =>
			c.guilds.cache.map((guild) => `${guild.name} [${guild.id}] - ${guild.memberCount} members.`))
		const guildsStringList: string[] = []
		// @ts-ignore
		for (let i = 0; i < allGuilds.length; i++) {
			// @ts-ignore
			guildsStringList.push(`Shard ${i + 1}\n${allGuilds[i].join("\n")}`)
		}
		// const stats = await this.client.fetchStats()
		logger.info(`Logged in as ${this.client.user?.tag} [${this.client.user?.id}]`) // with ${stats.guilds} guilds and ${stats.users} users.`)

		loadAndStartCrons(this.client)

		if (process.env.NODE_ENV === "development") {
			this.client.guilds.cache.forEach(async (x) => {
				await database.guild.upsert({
					where: {
						id: x.id,
					},
					update: {
						name: x.name,
					},
					create: {
						id: x.id,
						name: x.name,
					},
				})
			})
		}
	}
}

async function loadAndStartCrons(client: BetterClient) {
	logger.info("[CRON] Starting CRONs...")
	const jobs = getFiles(join(__dirname, "../jobs"), "js")
	for await (const job of jobs) {
		logger.info(`[CRON] Starting CRON "${job}"`)
		// eslint-disable-next-line no-await-in-loop
		const { startCron } = await import(join(__dirname, "../jobs", job))
		startCron(client)
		logger.info(`[CRON] Started CRON "${job}"`)
	}
	logger.info(`[CRON] Started ${jobs.length} CRONs.`)
}
