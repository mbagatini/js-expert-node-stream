export class View {
	#btnInitRecognition
	#elemStatusRecognition

	constructor() {
		this.#btnInitRecognition = document.querySelector('#initRecognition')
		this.#elemStatusRecognition = document.querySelector('#statusRecognition')
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
}