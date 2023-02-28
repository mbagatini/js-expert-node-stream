export function supportsWorkerType() {
	let supports = false

	const condition = {
		get type() { supports = true }
	}

	// check if the browser supports Worker and kill the instance after the test
	try {
		new Worker('blob://', condition).terminate()
	} finally {
		return supports
	}
}