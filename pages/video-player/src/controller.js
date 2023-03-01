export class Controller {
	#view
	#camera
	#worker
	#counter

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
		const blinkedTimes = ` - blinked ${this.#counter}`
		this.#view.log(`${message}`.concat(this.#counter ? blinkedTimes : ""))
	}

	onRecognitionInit() {
		this.log('Initializing detection...')
		this.#counter = 0
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

			if (data.blinked) this.#counter++
			this.#view.togglePlayVideo()
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
		this.log('Detecting eye blink...')

		setTimeout(() => this.loopFaceRegonition(), 500);
	}
}