import { Controller } from './controller.js'
import { View } from './view.js'
import { Service } from './service.js'

export const factory = {
	async initalize() {
		return Controller.initialize({
			view: new View(),
			service: new Service(),
		})
	}
}