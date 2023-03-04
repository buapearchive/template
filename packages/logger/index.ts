import Logger from "./Logger"
const logger = new Logger()

export { logger }

export enum DebugType {
	GENERAL = "general",
	COMMAND = "command",
	EVENT = "event",
	I18N = "i18n",
	LVL = "leveling",
}
