import { describe, expect, it } from 'vitest'
import { imageUtils } from './image-utils'

describe('imageUtils', () => {
	describe('convertImageToBase64', () => {
		it('should convert a valid image file to a Base64 string', async () => {
			const file = new File(['dummy content'], 'test.png', {
				type: 'image/png'
			})
			const base64String = await imageUtils.convertImageToBase64(file)
			expect(base64String).toMatch(/^data:image\/png;base64,/)
		})

		it('should reject with an error if the file cannot be read', async () => {
			const file = new File(['dummy content'], 'test.png', {
				type: 'image/png'
			})
			const originalReadAsDataURL = FileReader.prototype.readAsDataURL
			FileReader.prototype.readAsDataURL = function () {
				if (this.onerror) {
					const event = new ProgressEvent('error')
					Object.defineProperty(event, 'target', { value: this })
					this.onerror(event as ProgressEvent<FileReader>)
				}
			}

			await expect(imageUtils.convertImageToBase64(file)).rejects.toThrow(
				'Error reading file'
			)

			FileReader.prototype.readAsDataURL = originalReadAsDataURL
		})

		it('should reject with an error if the result is not a string', async () => {
			const file = new File(['dummy content'], 'test.png', {
				type: 'image/png'
			})
			const originalReadAsDataURL = FileReader.prototype.readAsDataURL
			FileReader.prototype.readAsDataURL = function () {
				if (this.onload) {
					const event = new ProgressEvent('load')
					Object.defineProperty(event, 'target', {
						value: { result: null }
					})
					this.onload(event as ProgressEvent<FileReader>)
				}
			}

			await expect(imageUtils.convertImageToBase64(file)).rejects.toThrow(
				'Failed to convert image to Base64'
			)

			FileReader.prototype.readAsDataURL = originalReadAsDataURL
		})

		it('should create an HTMLImageElement with the correct src', () => {
			const base64String = 'data:image/png;base64,dummybase64string'
			const img = imageUtils.createImageFromBase64(base64String)
			expect(img).toBeInstanceOf(HTMLImageElement)
			expect(img.src).toBe(base64String)
		})

		it('should create an HTMLImageElement with an empty src if the base64 string is empty', () => {
			const base64String = ''
			const img = imageUtils.createImageFromBase64(base64String)
			expect(img).toBeInstanceOf(HTMLImageElement)
			expect(img.src).toBe(document.location.href)
		})
	})
})
