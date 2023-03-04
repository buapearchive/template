import { EventHandler } from "@internal/lib"
import { logger } from "@internal/logger"

export default class ShardReconnecting extends EventHandler {
	override async run(shardId: number) {
		logger.info(`Shard ${shardId} is reconnecting to the gateway!`)
	}
}
