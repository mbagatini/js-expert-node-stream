export class HandGestureController {
	#view
	#service
	#camera

	constructor({ view, service, camera }) {
		this.#view = view
		this.#service = service
		this.#camera = camera
	}

	async init() {
	}

	static async initialize(dependencies) {
		const controller = new HandGestureController(dependencies)
		return controller.init()
	}

	async #estimateHands(video) {
		return this.#detector.estimateHands(video, {
			flipHorizontal: true
		})
	}

	async #loopDetection() {
		await this.#service.initializeDetector()
		await this.#estimateHands()
		this.#view.loopDetection(this.#loopDetection.bind(this))
	}
}