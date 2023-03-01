export class Controller {
	#view
	#camera
	#worker

	constructor({ view, camera, worker }) {
		this.#view = view
		this.#camera = camera
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
		this.loopFaceRegonition()
	}

	#configureWorker(worker) {
		let isReady = false

		worker.onmessage = ({ data }) => {
			if (data === 'ready') {
				this.#view.enableButton()
				isReady = true
				return
			}

			console.log(data.blinked)
		}

		return {
			sendMessage(message) {
				if (!isReady) return

				worker.postMessage(message)
			}
		}
	}

	loopFaceRegonition() {
		const video = this.#camera.video
		const img = this.#view.getVideoFrame(video)

		this.#worker.sendMessage(img)

		setTimeout(() => this.loopFaceRegonition, 100);
	}
}