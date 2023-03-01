export class HandGestureController {
	#view
	#service

	constructor({ view, service }) {
		this.#view = view
		this.#service = service
	}

	async init() {
	}

	static async initialize(dependencies) {
		const controller = new HandGestureController(dependencies)
		return controller.init()
	}
}