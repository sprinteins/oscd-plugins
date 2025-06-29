async function convertImageToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => {
			if (typeof reader.result === 'string') {
				resolve(reader.result)
			} else {
				reject(new Error('Failed to convert image to Base64'))
			}
		}
		reader.onerror = () => reject(new Error('Error reading file'))
		reader.readAsDataURL(file)
	})
}

function createImageFromBase64(base64String: string): HTMLImageElement {
	const img = new Image()
	img.src = base64String
	return img
}

export const imageUtils = {
	convertImageToBase64,
	createImageFromBase64
}
