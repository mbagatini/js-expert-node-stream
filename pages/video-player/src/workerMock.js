// tensorflow dependencies
import "https://unpkg.com/@tensorflow/tfjs-core@2.4.0/dist/tf-core.js"
import "https://unpkg.com/@tensorflow/tfjs-converter@2.4.0/dist/tf-converter.js"
import "https://unpkg.com/@tensorflow/tfjs-backend-webgl@2.4.0/dist/tf-backend-webgl.js"
import "https://unpkg.com/@tensorflow-models/face-landmarks-detection@0.0.1/dist/face-landmarks-detection.js"

import { Service } from './service.js'

export async function initWorkerMock() {
	const service = new Service({
		faceLandmarksDetection: window.faceLandmarksDetection
	})

	const workerMock = {
		async postMessage(video) {
			const blinked = await service.hadBlinked(video)

			if (!blinked) return;

			workerMock.onmessage({ data: { blinked } })
		},
		// will be overwritten by controller
		onmessage(msg) { }
	}

	// console.log('loagind tf')
	await service.loadModel()
	// console.log('tf loaded')

	setTimeout(() => workerMock.onmessage({ data: 'ready' }), 500)

	return workerMock
}