onmessage = ({ data }) => {
	postMessage(
		{ response: 'ok', data: 'morgana' }
	)
}