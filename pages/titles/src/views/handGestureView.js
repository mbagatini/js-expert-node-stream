export class HandGestureView {
	#canvasHands
	#canvasContext
	#fingersLookup

	constructor({ fingersLookup}) {
		this.#fingersLookup = fingersLookup
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
			this.#canvasContext.fillStyle = 'yellow'
			this.#canvasContext.strokeStyle = 'white'
			this.#canvasContext.lineWidth = 10
			this.#canvasContext.lineJoin = 'round'

			// joints
			this.#drawJoints(keypoints)

			// fingers
			this.#drawFingersAndHoverElements(keypoints)
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

	#drawFingersAndHoverElements(keypoints) {
		const fingers = Object.keys(this.#fingersLookup)

		for (const finger of fingers) {
		  const points = this.#fingersLookup[finger].map(
			index => keypoints[index]
		  )

		  const region = new Path2D()

		  const [{ x, y }] = points

		  region.moveTo(x, y)

		  for(const point of points) {
			region.lineTo(point.x, point.y)
		  }

		  this.#canvasContext.stroke(region)
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