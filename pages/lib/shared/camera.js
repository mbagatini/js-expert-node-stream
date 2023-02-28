export class Camera {
	constructor() {
		// Creates the element on DOM
		this.video = document.createElement('video')
	}

	static async init() {
		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			throw new Error('Browser API navigator.mediaDevices.getUserMedia not available')
		}

		const videoConfig = {
			audio: false,
			video: {
				width: globalThis.screen.availWidth,
				height: globalThis.screen.availHeight,
				frameRate: {
					ideal: 60
				}
			}
		}

		// Ask permission to use camera
		const stream = await navigator.mediaDevices.getUserMedia(videoConfig)

		const camera = new Camera();

		camera.video.srcObject = stream
		camera.video.width = 240
		camera.video.height = 320

		// add the element
		document.body.append(camera.video)

		// wait for the camera to display
		await new Promise((resolve) => {
			camera.video.onloadeddata = () => {
				resolve(camera.video)
			}
		})

		camera.video.play()

		return camera
	}
}