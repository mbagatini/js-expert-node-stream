export class Service {
	#model = null
	#faceLandmarksDetection

	constructor({ faceLandmarksDetection }) {
		this.#faceLandmarksDetection = faceLandmarksDetection
	}

	async loadModel() {
		// load the model to detect the face
		this.#model = await this.#faceLandmarksDetection.load(
			this.#faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
			{ maxFaces: 1 }
		)
	}

	async hadBlinked(video) {
		const predictions = await this.#estimateFaces(video)
		console.log({ predictions })
	}

	// configuration for tenserflow face recognition
	#estimateFaces(video) {
		return this.#model.estimateFaces({
			input: video,
			returnTensors: false,
			flipHorizontal: true,
			predictIrises: true
		})
	}
}