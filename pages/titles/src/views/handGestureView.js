export class HandGestureView {
	loopDetection(frameRequestCallback) {
		requestAnimationFrame(frameRequestCallback)
	}

	scrollPage(top) {
		scroll({
			top,
            behavior:'smooth'
		})
	}
}