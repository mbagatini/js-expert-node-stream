export class HandGestureService {
	#gestureEstimation
	#handPoseDetection
	#handsVersion
	#gesturesStrings
	#detector = null

	constructor({ fingerpose, handPoseDetection, handsVersion, knownGestures, gesturesStrings }) {
		this.#gestureEstimation = new fingerpose.GestureEstimator(knownGestures)
		this.#handPoseDetection = handPoseDetection
		this.#handsVersion = handsVersion
		this.#gesturesStrings = gesturesStrings
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

	#getLandMarksFromKeypoints(keypoints3D) {
		return keypoints3D.map(keypoint =>
			[keypoint.x, keypoint.y, keypoint.z]
		)
	}

	async estimate(keypoints3D) {
		const predictions = await this.#gestureEstimation.estimate(
			this.#getLandMarksFromKeypoints(keypoints3D),
			9 // confidence percentage
		)

		return predictions.gestures
	}

	async * detectGestures(predictions) {
		for (const hand of predictions) {
			if (!hand.keypoints3D) continue

			const gestures = await this.estimate(hand.keypoints3D)

			if (!gestures.length) continue

			// keep the gesture which score is the most accurately predicted
			const gesture = gestures.reduce((prev, cur) => {
				return prev.score > cur.score ? prev : cur
			})

			console.log('detected', this.#gesturesStrings[gesture.name])

			// search for the finger tip
			const { x, y } = hand.keypoints.find(keypoint => keypoint.name === 'index_finger_tip')

			// magic of async interator
			yield { event: gesture.name, x, y }
		}
	}
}