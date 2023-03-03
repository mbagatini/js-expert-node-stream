export class HandGestureView {
	#canvasHands
	#canvasContext
	#fingersLookup
	#styler

	constructor({ fingersLookup, styler }) {
		this.#fingersLookup = fingersLookup
		this.#canvasHands = document.querySelector('#hands')
		this.#canvasContext = this.#canvasHands.getContext('2d')
		this.#styler = styler

		this.#canvasHands.width = globalThis.screen.availWidth
		this.#canvasHands.height = globalThis.screen.availHeight

		// loads the css asynchronously
		setTimeout(() => {
			this.#styler.loadDocumentStyles()
		}, 200);
	}

	clearCanvas() {
		this.#canvasContext.clearRect(0, 0, this.#canvasHands.width, this.#canvasHands.height)
	}

	drawHands(hands) {
		for (const { keypoints } of hands) {
			if (!keypoints) continue

			// fingers
			this.#canvasContext.fillStyle = 'magenta'
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

			for (const point of points) {
				region.lineTo(point.x, point.y)
			}

			this.#canvasContext.stroke(region)

			this.#hoverElement(finger, points)
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

	clickOnElement(x, y) {
		const element = document.elementFromPoint(x, y)

		if (!element) return

		// print found element
		// console.log({ element, x, y })

		const rect = element.getBoundingClientRect()
		const clickEvent = new MouseEvent('click', {
			view: window,
			bubbles: true,
			cancelable: true,
			clientX: rect.left + x,
			clientY: rect.top + y
		})

		element.dispatchEvent(clickEvent)
	}

	#hoverElement(finger, points) {
		// get tip of index finger
		if (finger !== "indexFinger") return
		const tip = points.find(item => item.name === "index_finger_tip")

		const element = document.elementFromPoint(tip.x, tip.y)

		if (!element) return

		const toggleStyleFn = () => this.#styler.toggleStyle(element, ':hover')

		toggleStyleFn()

		setTimeout(() => toggleStyleFn(), 500);
	}
}