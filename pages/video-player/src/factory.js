import { Controller } from './controller.js'
import { View } from './view.js'
import { initWorkerMock } from './workerMock.js'
import { Camera } from '../../lib/shared/camera.js'
import { supportsWorkerType } from '../../lib/shared/supportsWorker.js'

async function getWorker() {
	// check if it can use a new thread
	if (supportsWorkerType()) {
		console.log('Initializing with worker')
		const worker = new Worker('./src/worker.js', { type: 'module' })
		return worker
	}

	// use the single thread
	console.warn('Worker not supported, using mock')
	const workerMock = initWorkerMock()
	return workerMock
}

const worker = await getWorker()

const camera = await Camera.init()

export const factory = {
	async initalize() {
		return Controller.initialize({
			view: new View(),
			camera,
			worker
		})
	}
}