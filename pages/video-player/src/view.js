export class View {
	#btnInitRecognition
	#elemStatusRecognition
	#canvasVideoFrame
	#canvasContext
	#videoElement

	constructor({ videoUrl }) {
		this.#videoElement = document.querySelector('#video')
		this.#btnInitRecognition = document.querySelector('#initRecognition')
		this.#elemStatusRecognition = document.querySelector('#statusRecognition')
		this.#canvasVideoFrame = document.createElement('canvas')
		this.#canvasContext = this.#canvasVideoFrame.getContext('2d', { willReadFrequently: true })
	
		this.#setVideoSource(videoUrl)
	}

	enableButton() {
		this.#btnInitRecognition.disabled = false
	}

	configueOnBtnClick(fn) {
		this.#btnInitRecognition.addEventListener('click', fn)
	}

	log(message) {
		this.#elemStatusRecognition.innerHTML = message
	}

	// converts the video frame to a canvas so worker can manage it
	getVideoFrame(video) {
		const canvas = this.#canvasVideoFrame
		const [ width, height ] = [video.videoWidth, video.videoHeight]
		canvas.width = width
		canvas.height = height

		this.#canvasContext.drawImage(video, 0, 0, width, height)
		return this.#canvasContext.getImageData(0, 0, width, height)
	}

	togglePlayVideo() {
		if (this.#videoElement.paused) {
			this.#videoElement.play()
		} else {
			this.#videoElement.pause()
		}
	}

	#setVideoSource(url) {
		this.#videoElement.src = url
	}
}