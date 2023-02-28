export class Controller {
	#view
	#service

	constructor({ view, service }) {
		this.#view = view
		this.#service = service
	}

	async init() {
	}

	static async initialize(dependencies) {
		const controller = new Controller(dependencies)
		return controller.init()
	}
}