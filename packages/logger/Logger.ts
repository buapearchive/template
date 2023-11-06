import {
	Logger as WinstonLogger,
	createLogger,
	format,
	transports
} from "winston"
import { DebugType } from "./index.js"

export default class Logger {
	private winston: WinstonLogger

	constructor() {
		this.winston = createLogger({
			transports: [
				new transports.Console({
					format: format.combine(
						format.timestamp(),
						format.colorize(),
						format.simple(),
						format.errors({ stack: true })
					),
					handleExceptions: true,
					handleRejections: true,
					level: "silly"
				})
			]
		})
	}

	public log(message: string, properties?: { [key: string]: never }): void {
		this.winston.log(message, properties)
	}

	public debug(
		// biome-ignore lint/suspicious/noExplicitAny: logger
		message: any,
		type: DebugType = DebugType.GENERAL,
		properties?: { [key: string]: never }
	): void {
		// biome-ignore lint/style/noParameterAssign: small function; readable
		if (typeof message === "object") message = JSON.stringify(message, null, 2)
		this.winston.debug(message, { type, ...properties })
	}

	public warn(
		message: string,
		properties: { [key: string]: never } = {}
	): void {
		this.winston.warn(message, properties)
	}

	public info(message: string, properties?: { [key: string]: never }): void {
		this.winston.info(message, properties)
	}

	public error(
		message: string,
		properties: { [key: string]: never } = {}
	): void {
		this.winston.error(message)
		this.null(properties)
	}

	public thrownError(
		error: Error,
		properties: { [key: string]: never } = {}
	): void {
		console.error(error)
		this.winston.error(`${error.message} ${error.stack}`)
		this.null(properties)
	}

	public null(..._args: unknown[]): null {
		return null
	}
}
