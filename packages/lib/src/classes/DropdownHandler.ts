import { BetterClient, _BaseHandler, HandlerType } from "../.."

export default class DropdownHandler extends _BaseHandler {
	constructor(client: BetterClient) {
		super(HandlerType.Dropdown, client)
	}
}
