<script lang="ts">
export let content = ''
export let onContentChange: (newContent: string) => void
import { imageUtils } from '@/utils'
import type { ImageData } from './types.image'

let parsedContent: ImageData = { scale: 'Small', base64Data: '' }
if (content) {
	parsedContent = JSON.parse(content) as ImageData
}

let imagePreview = imageUtils.createImageFromBase64(
	parsedContent?.base64Data
).src
let imageScale: string = parsedContent?.scale || 'Small'

async function handleImageUpload(event) {
	const file = event.target.files[0]
	if (file?.type?.startsWith('image/')) {
		const base64String = await imageUtils.convertImageToBase64(file)
		const reader = new FileReader()
		reader.onload = (e: ProgressEvent<FileReader>) => {
			imagePreview = e.target?.result as string
		}
		reader.readAsDataURL(file)

		const data: ImageData = {
			scale: imageScale,
			base64Data: base64String
		}

		onContentChange(JSON.stringify(data))
	} else {
		alert('Please upload a valid image file')
	}
}

async function handleImageScale() {
	const data = JSON.parse(content) as ImageData
	data.scale = imageScale

	onContentChange(JSON.stringify(data))
}
</script>



<div class="image-upload-section">
	<label for="imageUpload">Upload Image:</label>
	<input type="file" id="imageUpload" accept="image/*" on:change={handleImageUpload} />
	{#if imagePreview}
		<div class="image-scale-section">
			<label for="imageScale">Image size</label>
			<select id="imageScale" bind:value={imageScale} on:change={handleImageScale}>
				<option>Small</option>	
				<option>Medium</option>	
				<option>Large</option>	
			</select>
		</div>
		<div class="image-preview">
			<img src={imagePreview} alt="Uploaded Image" />
		</div>
	{/if}
</div>



<style>
.image-upload-section {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}
.image-preview img {
	max-width: 150px;
	max-height: 150px;
}
.image-scale-section {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
}
</style>