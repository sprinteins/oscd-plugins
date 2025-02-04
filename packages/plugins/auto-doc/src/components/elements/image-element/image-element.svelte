<script lang="ts">

	export let content = "";
	export let onContentChange: (newContent: string) => void;
	import {imageUtils} from "@/utils"

	let imagePreview = imageUtils.createImageFromBase64(content);

	async function handleImageUpload(event) {
		const file = event.target.files[0];
		if (file && file.type.startsWith('image/')) {
			const base64String = await imageUtils.convertImageToBase64(file)
		const reader = new FileReader();
		reader.onload = (e: ProgressEvent<FileReader>) => {
			imagePreview = e.target?.result as string; 
		};
		reader.readAsDataURL(file); 
		onContentChange(base64String);

		} else {
			alert('Please upload a valid image file');
		}
  }
</script>



<div class="image-upload-section">
	<label for="imageUpload">Upload Image:</label>
	<input type="file" id="imageUpload" accept="image/*" on:change={handleImageUpload} />
	{#if imagePreview}
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
</style>