import { knownGestures, gesturesStrings } from "../util/Gestures.js"

export class HandGestureService {
	#gestureEstimation
	#handPoseDetection
	#handsVersion
	#detector = null

	constructor({ fingerpose, handPoseDetection, handsVersion }) {
		this.#gestureEstimation = new fingerpose.GestureEstimator(knownGestures)
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
				return prev.score > cur.score? prev : cur
			})

			console.log('detected', gesturesStrings[gesture.name])
		}
	}
}