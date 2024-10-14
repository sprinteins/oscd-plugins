<script lang="ts">

  import ImageElement from "../elements/image/image-element.svelte";
  import TextElement from "../elements/text/text-element.svelte";


  let elements : Element[]= []

  type Element = {
    id: string,
    type: "image" | "text" | "heading"
    content: string | undefined
  }


  function generateRandomId(){
    return Math.random().toString(16).slice(2)
  }

  function addElement(type: "image" | "text" | "heading"){
    const newElement : Element = {
      id: generateRandomId(),
      type: type,
      content: undefined
    }

    elements = [...elements, newElement];
  }


</script>

<document-builder>

  <div class="elements-list">
    {#each elements as element (element.id)}
      {#if element.type === 'heading'}
        <!-- <HeadingElement bind:content={element.data} /> -->
      {:else if element.type === 'text'}
        <TextElement bind:content={element.content} />
      {:else if element.type === 'image'}
        <ImageElement bind:src={element.content} />
      {/if}
    {/each}
  </div>

  <div class="add-buttons">
    <button on:click={() => addElement('text')}>Add Text</button>
    <button on:click={() => addElement('image')}>Add Image</button>
  </div>

</document-builder>

<style>
  .elements-list,
  .add-buttons{
    display: flex;
		gap: 1rem;
	}
  
  .elements-list{
    flex-direction: column;
    
  }
  
</style>
