export class Controller {
	#view
	#service

	constructor({ view, service }) {
		this.#view = view
		this.#service = service

		this.#view.configueOnBtnClick(this.onRecognitionInit.bind(this))
	}

	async init() {
	}

	static async initialize(dependencies) {
		const controller = new Controller(dependencies)

		controller.log('Recognition not initialized, click in the button to start')

		return controller.init()
	}

	log(message) {
		this.#view.log(`Message: ${message}`)
	}

	onRecognitionInit() {
		this.log('Initializing detection...')
	}
}