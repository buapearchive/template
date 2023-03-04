import { BetterClient } from "@internal/lib"
import * as config from "@internal/config"
import { DebugType, logger } from "@internal/logger"

const client = new BetterClient({
	allowedMentions: { parse: ["users"] },
	intents: config.intents,
})

client.login().catch((error) => {
	logger.debug(JSON.stringify(config, null, 2), DebugType.GENERAL)
	logger.thrownError(error)
})

process.on("uncaughtException", (err) => {
	logger.thrownError(err)
})
