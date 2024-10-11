<script lang="ts">
	import Theme from "../../theme/theme.svelte"
	
	export let root: Element

	let htmlRoot: HTMLElement

	let title : string
	let description : string
	let templateText : string
	let imagePreview
	let uploadedImage: FileReader = null


	function handleImageUpload(event) {
		const file = event.target.files[0];
		if (file && file.type.startsWith('image/')) {
		const reader = new FileReader();
		reader.onload = (e) => {
			imagePreview = e.target.result; 
		};
		reader.readAsDataURL(file); 
		uploadedImage = file;
		} else {
		alert('Please upload a valid image file');
		}
  }

  
</script>

<Theme>
	<auto-doc bind:this={htmlRoot}>
		<main class="container">
			<div class="template-title">
				<input type="text" bind:value={title} placeholder="Name of the template">
				<input type="text" bind:value={description} placeholder="add description of the template">
			</div>

			<section class="template-body">
					<textarea 
						name="templateText"
						id=""
						bind:value={templateText}
						placeholder="This is an example textbox"
						
						/>

					<div class="image-upload-section">
						<label for="imageUpload">Upload Image:</label>
						<input type="file" id="imageUpload" accept="image/*" on:change={handleImageUpload} />
						{#if imagePreview}
						  <div class="image-preview">
							<img src={imagePreview} alt="Uploaded Image" />
						  </div>
						{/if}
					  </div>
			</section>

		</main>
	</auto-doc>
</Theme>

<style lang="scss">
	:root, :host {
		--header-height: 128px;
	}
	auto-doc {
		height: calc(100vh - var(--header-height));;
		display: flex;
 	 	align-items: stretch;
		position: relative;
	}

	.container {
		padding: 2em;
		width: 100%;
		justify-items: center;
		background-color: antiquewhite;
	}

	

	.template-title,
	.template-body{
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.template-title{
		input{
			font-size: 2rem;
			padding: .7em;
			border: none;

			&:nth-child(even){
				font-size: 1.5rem;
			}
		}
	}

	.template-body{
		border: 1.7px solid black;
		padding: 2em 2.5em;
		margin-top: 2rem;

		textarea {
			width: 100%;
			padding: 0.5rem;
			font-size: 1rem;
		}

		.image-upload-section {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}

		.image-preview img {
			max-width: 150px;
			max-height: 150px;
		}
	}

</style>
