<script lang="ts">

  import ImageElement from "../elements/image/image-element.svelte";
  import TextElement from "../elements/text/text-element.svelte";


  let elements : Element[] = []

  type Element = {
    id: string,
    type: "image" | "text" | "heading"
    content: string | undefined
  }


  function generateRandomId(){
    return `${crypto.randomUUID()}|${(Math.random() * 50)}`
  }

  function addElement(type: "image" | "text" | "heading"){
    const newElement : Element = {
      id: generateRandomId(),
      type: type,
      content: undefined
    }

    elements = [...elements, newElement];
  }


  function removeElement(id: string){
    elements = elements.filter(e => e.id !== id);
  }


</script>

<document-builder>

  <div class="elements-container">
    {#each elements as element (element.id)}
      <div class="elements-list">
        {#if element.type === 'heading'}
          <!-- <HeadingElement bind:content={element.data} /> -->
        {:else if element.type === 'text'}
          <TextElement bind:content={element.content} />
        {:else if element.type === 'image'}
          <ImageElement bind:src={element.content} />
        {/if}
      </div>

      <div>
        <button on:click={()=> removeElement(element.id)}>remove</button>
      </div>
    {/each}
  </div>

  <div class="add-buttons">
    <button on:click={() => addElement('text')}>Add Text</button>
    <button on:click={() => addElement('image')}>Add Image</button>
  </div>

</document-builder>

<style>
  .elements-container{
    display: grid;
    grid-template-columns: 94% 5%;
    gap: 1rem
  }

  .elements-list{
    display: flex;
    flex-direction: column;
  }

  .add-buttons{
		margin-top: 2rem;
    display: flex;
		gap: 1rem;
	}
  
</style>
