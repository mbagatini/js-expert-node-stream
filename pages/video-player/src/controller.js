export class Controller {
	#view
	#service
	#worker

	constructor({ view, service, worker }) {
		this.#view = view
		this.#service = service
		this.#worker = this.#configureWorker(worker)

		this.#view.configueOnBtnClick(this.onRecognitionInit.bind(this))
	}

	async init() {
		console.log('init')
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

	#configureWorker(worker) {
		worker.onmessage = (message) => {
			console.log(message)

			if (message.data === 'ready') {
				this.#view.enableButton()
				return
			}
		}

		return worker
	}
}