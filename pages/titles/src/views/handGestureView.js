export class HandGestureView {
	#canvasHands
	#canvasContext

	constructor() {
		this.#canvasHands = document.querySelector('#hands')
		this.#canvasContext = this.#canvasHands.getContext('2d')
		this.#canvasHands.width = globalThis.screen.availWidth
		this.#canvasHands.height = globalThis.screen.availHeight
	}

	clearCanvas() {
		this.#canvasContext.clearRect(0, 0, this.#canvasHands.width, this.#canvasHands.height)
	}

	drawHands(hands) {
		for (const { keypoints }  of hands) {
			if (!keypoints) continue

			// fingers
			this.#canvasContext.fillStyle = 'orange'
			this.#canvasContext.strokeStyle = 'white'
			this.#canvasContext.lineWidth = 10
			this.#canvasContext.lineJoin = 'round'

			// joients
			this.#drawJoints(keypoints)
		}
	}

	#drawJoints(keypoints) {
		for (const { x, y } of keypoints) {
			this.#canvasContext.beginPath()
			const newX = x - 2
			const newY = y - 2
			const radius = 3
			const startAngle = 0
			const endAngle = 2 * Math.PI

			this.#canvasContext.arc(newX, newY, radius, startAngle, endAngle)
			this.#canvasContext.fill()
		}
	}

	loopDetection(frameRequestCallback) {
		requestAnimationFrame(frameRequestCallback)
	}

	scrollPage(top) {
		scroll({
			top,
			behavior: 'smooth'
		})
	}
}