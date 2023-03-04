import { PrismaClient } from "@prisma/client"
import { Client } from "unb-api"

const database = new PrismaClient()
let unbClient: Client | null
if (process.env.UNB_API_KEY) {
	unbClient = new Client(process.env.UNB_API_KEY as string)
}
export { unbClient }

export default database

export * from "@prisma/client"

export * from "./src/getData"
export * from "./src/getApiAccess"
export * from "./src/settings"
export * from "./src/factoryReset"
export * from "./src/permissions"
export * from "./src/blacklist"
export * from "./src/levelUp"

export enum ApiPermission {
	Levels = 1 << 0,
	Multipliers = 1 << 1,
	Export = 1 << 2,
	Blacklist = 1 << 3,
}
