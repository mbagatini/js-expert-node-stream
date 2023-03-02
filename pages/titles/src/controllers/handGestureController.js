import { shouldRunChecker } from '../../../lib/shared/shouldRunChecker.js'

const { shouldRun } = shouldRunChecker({ timerDelay: 200 })

export class HandGestureController {
	#view
	#service
	#camera
	#lastDirectionScroll = {
		direction: '',
		y: 0
	}

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

			// hands element
			this.#view.clearCanvas()

			if (hands?.length) {
				this.#view.drawHands(hands)
			}

			// async interator
			for await (const gesture of this.#service.detectGestures(hands)) {
				const { event, x, y } = gesture

				if (event.includes('scroll') && shouldRun()) {
					this.#scrollPage(event)
				}
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

	#scrollPage(direction) {
		const pixelsScroll = 200

		if (this.#lastDirectionScroll.direction === direction) {
			this.#lastDirectionScroll.y = direction === 'scroll-up' ?
				this.#lastDirectionScroll.y - pixelsScroll :
				this.#lastDirectionScroll.y + pixelsScroll
		} else {
			this.#lastDirectionScroll.direction = direction
		}

		this.#view.scrollPage(this.#lastDirectionScroll.y)
	}
}