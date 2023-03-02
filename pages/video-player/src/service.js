import { shouldRunChecker } from '../../lib/shared/shouldRunChecker.js'

const EAR_THRESHOLD = 0.27

const { shouldRun } = shouldRunChecker({ timerDelay: 500 })

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
		// console.log({ predictions })

		if (!predictions.length) return false;

		for (const prediction of predictions) {
			// Right eye parameters
			const lowerRight = prediction.annotations.rightEyeUpper0
			const upperRight = prediction.annotations.rightEyeLower0
			const rightEAR = this.#getEAR(upperRight, lowerRight)
			// Left eye parameters
			const lowerLeft = prediction.annotations.leftEyeUpper0
			const upperLeft = prediction.annotations.leftEyeLower0
			const leftEAR = this.#getEAR(upperLeft, lowerLeft)

			if (leftEAR <= EAR_THRESHOLD && rightEAR > EAR_THRESHOLD) {
				console.log('- blinked left eye')
			} else if (leftEAR > EAR_THRESHOLD && rightEAR <= EAR_THRESHOLD) {
				console.log('- blinked right eye')
			}

			// True if the eye is closed
			const blinked = leftEAR <= EAR_THRESHOLD && rightEAR <= EAR_THRESHOLD

			if (!shouldRun()) continue

			if (blinked) return true
		}

		return false
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

	// Calculate the position of eyelid to predict a blink
	#getEAR(upper, lower) {
		function getEucledianDistance(x1, y1, x2, y2) {
			return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
		}

		return (
			(getEucledianDistance(upper[5][0], upper[5][1], lower[4][0], lower[4][1])
				+ getEucledianDistance(
					upper[3][0],
					upper[3][1],
					lower[2][0],
					lower[2][1],
				))
			/ (2
				* getEucledianDistance(upper[0][0], upper[0][1], upper[8][0], upper[8][1]))
		);
	}
}