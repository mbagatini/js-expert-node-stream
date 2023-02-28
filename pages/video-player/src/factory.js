import { Controller } from './controller.js'
import { View } from './view.js'
import { Service } from './service.js'
import { Camera } from '../../lib/shared/camera.js'
import { supportsWorkerType } from '../../lib/shared/supportsWorker.js'

async function getWorker() {
	if (supportsWorkerType()) {
		console.log('Worker supported')
		const worker = new Worker('./src/worker.js', { type: 'module'})
		return worker
	}

	console.log('Worker not supported')
	const workerMock = {
		async postMessage() {},
		onmessage(msg) {}
	}
	return workerMock
}

const worker = await getWorker()

const camera = Camera.init()

export const factory = {
	async initalize() {
		return Controller.initialize({
			view: new View(),
			service: new Service({}),
			worker
		})
	}
}