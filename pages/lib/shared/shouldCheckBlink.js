export function prepareBlinkChecker({ timerDelay }) {
	let lastRun = Date.now()

	return {
		shouldCheckBlink() {
			const valid = (Date.now() - lastRun) > timerDelay
	
			if (valid) lastRun = Date.now()
	
			return valid
		}
	}
}