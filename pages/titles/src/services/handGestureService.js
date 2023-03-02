export class HandGestureService {
	#fingerpose
	#handPoseDetection
	#handsVersion
	#detector = null

	constructor({ fingerpose, handPoseDetection, handsVersion }) {
		this.#fingerpose = fingerpose
		this.#handPoseDetection = handPoseDetection
		this.#handsVersion = handsVersion
	}

	async initializeDetector() {
		if (this.#detector) return this.#detector

		const detectorConfig = {
			runtime: 'mediapipe', // or 'tfjs',
			solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${this.#handsVersion}`,
			modelType: 'lite', // full is the haviest and most precise, but lite works fine here
			maxHands: 2
		}

		this.#detector = await this.#handPoseDetection.createDetector(
			this.#handPoseDetection.SupportedModels.MediaPipeHands,
			detectorConfig
		)

		return this.#detector
	}

	async estimateHands(video) {
		return this.#detector.estimateHands(video, {
			flipHorizontal: true
		})
	}
}