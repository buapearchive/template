// export every file in the package
export { default as _BaseComponent } from "./src/classes/_BaseComponent"
export { default as _BaseHandler } from "./src/classes/_BaseHandler"
export { default as ApplicationCommand } from "./src/classes/ApplicationCommand"
export { default as ApplicationCommandHandler } from "./src/classes/ApplicationCommandHandler"
export { default as AutoCompleteHandler } from "./src/classes/AutoCompleteHandler"
export { default as Button } from "./src/classes/Button"
export { default as ButtonHandler } from "./src/classes/ButtonHandler"
export { default as Debugger } from "./src/classes/Debugger"
export { default as Dropdown } from "./src/classes/Dropdown"
export { default as DropdownHandler } from "./src/classes/DropdownHandler"
export { default as EventHandler } from "./src/classes/EventHandler"
export { default as ModalSubmit } from "./src/classes/ModalSubmit"
export { default as ModalSubmitHandler } from "./src/classes/ModalSubmitHandler"
export { default as StopWatch } from "./src/classes/StopWatch"
export { default as TextCommand } from "./src/classes/TextCommand"
export { default as TextCommandHandler } from "./src/classes/TextCommandHandler"
export { default as Type } from "./src/classes/Type"
export { default as BetterClient } from "./src/extensions/BetterClient"

// --------------------- Typings ----------------------------

import { ApplicationCommandOptionData, ApplicationCommandType, PermissionsBitField } from "discord.js"

export interface BaseComponentOptions {
	permissions?: PermissionsBitField
	clientPermissions?: PermissionsBitField
	adminOnly?: boolean
	guildOnly?: boolean
	ownerOnly?: boolean
	cooldown?: number
	authorOnly?: boolean
}

export interface ApplicationCommandOptions extends BaseComponentOptions {
	description: string
	options?: ApplicationCommandOptionData[]
	type?: ApplicationCommandType
}
export type ButtonOptions = BaseComponentOptions
export type DropdownOptions = BaseComponentOptions
export type TextCommandOptions = Pick<BaseComponentOptions, "adminOnly">

export enum HandlerType {
	ApplicationCommand = "applicationCommands",
	Button = "buttons",
	Dropdown = "dropdowns",
	TextCommand = "textCommands",
}
