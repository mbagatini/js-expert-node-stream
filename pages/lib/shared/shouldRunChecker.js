export function shouldRunChecker({ timerDelay }) {
	let lastRun = Date.now()

	return {
		shouldRun() {
			const valid = (Date.now() - lastRun) > timerDelay
	
			if (valid) lastRun = Date.now()
	
			return valid
		}
	}
}