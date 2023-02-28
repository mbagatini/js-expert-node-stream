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
}