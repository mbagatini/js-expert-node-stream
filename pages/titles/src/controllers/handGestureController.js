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
		return this.#loopDetection()
	}

	static async initialize(dependencies) {
		const controller = new HandGestureController(dependencies)
		return controller.init()
	}

	async #estimateHands() {
		try {
            const hands = await this.#service.estimateHands(this.#camera.video)
			
			for await (const gesture of this.#service.detectGestures(hands)) {
				console.log(gesture)
			}
        } catch (error) {
            console.error(error)
        }
	}

	async #loopDetection() {
		await this.#service.initializeDetector()
		await this.#estimateHands()
		this.#view.loopDetection(this.#loopDetection.bind(this))
	}
}