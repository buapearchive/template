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

	// biome-ignore lint/suspicious/noExplicitAny: logger
	public log(message: string, properties?: { [key: string]: any }): void {
		this.winston.log(message, properties)
	}

	public debug(
		// biome-ignore lint/suspicious/noExplicitAny: logger
		message: any,
		type: DebugType = DebugType.GENERAL,
		// biome-ignore lint/suspicious/noExplicitAny: logger
		properties?: { [key: string]: any }
	): void {
		// biome-ignore lint/style/noParameterAssign: small function; readable
		if (typeof message === "object") message = JSON.stringify(message, null, 2)
		this.winston.debug(message, { type, ...properties })
	}

	public warn(
		message: string,
		// biome-ignore lint/suspicious/noExplicitAny: logger
		properties: { [key: string]: any } = {}
	): void {
		this.winston.warn(message, properties)
	}

	// biome-ignore lint/suspicious/noExplicitAny: logger
	public info(message: string, properties?: { [key: string]: any }): void {
		this.winston.info(message, properties)
	}

	public error(
		message: string,
		// biome-ignore lint/suspicious/noExplicitAny: logger
		properties: { [key: string]: any } = {}
	): void {
		this.winston.error(message)
		this.null(properties)
	}

	public thrownError(
		error: Error,
		// biome-ignore lint/suspicious/noExplicitAny: logger
		properties: { [key: string]: any } = {}
	): void {
		console.error(error)
		this.winston.error(`${error.message} ${error.stack}`)
		this.null(properties)
	}

	public null(..._args: unknown[]): null {
		return null
	}
}
