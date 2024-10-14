<script lang="ts">
	export let src = "";
	let imagePreview = src;
	let uploadedImage: FileReader = null


	function handleImageUpload(event) {
		const file = event.target.files[0];
		if (file && file.type.startsWith('image/')) {
		const reader = new FileReader();
		reader.onload = (e) => {
			imagePreview = e.target.result as string; 
		};
		reader.readAsDataURL(file); 
		uploadedImage = file;
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