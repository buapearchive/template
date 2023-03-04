import { BetterClient, _BaseHandler, HandlerType } from "../.."
export default class ButtonHandler extends _BaseHandler {
	constructor(client: BetterClient) {
		super(HandlerType.Button, client)
	}
}
