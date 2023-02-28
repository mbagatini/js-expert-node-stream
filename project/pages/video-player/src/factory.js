import { Controller } from './controller.js'
import { View } from './view.js'
import { Service } from './service.js'
import { Camera } from '../../lib/shared/camera.js'

const camera = Camera.init()

export const factory = {
	async initalize() {
		return Controller.initialize({
			view: new View(),
			service: new Service(),
		})
	}
}