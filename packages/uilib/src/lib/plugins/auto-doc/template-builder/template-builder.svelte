<script lang="ts">

  import ImageElement from "../elements/image/image-element.svelte";
  import TextElement from "../elements/text/text-element.svelte";
  import HeadingElement from "../elements/heading/heading-element.svelte";


  let elements : Element[] = []


  let isAccordionOpen = false

  enum ElementType {
    TEXT = "Text",
    IMAGE = "Image",
    HEADING = "Heading",
  } 
  
  type Element = {
    id: string,
    type: ElementType
    content: string | undefined
  }


  function generateRandomId(){
    return `${crypto.randomUUID()}|${(Math.random() * 50)}`
  }

  function addElement(type: ElementType){
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
        {#if element.type === ElementType.HEADING}
          <HeadingElement bind:content={element.content} />
        {:else if element.type === ElementType.TEXT}
          <TextElement bind:content={element.content} />
        {:else if element.type === ElementType.IMAGE}
          <ImageElement bind:src={element.content} />
        {/if}
      </div>

      <div>
        <button on:click={()=> removeElement(element.id)}>remove</button>
      </div>
    {/each}
    
  </div>
  
  <footer>
    <button on:click={()=> isAccordionOpen = !isAccordionOpen}>Add element</button>
    {#if isAccordionOpen}
      <div class="add-buttons">
        {#each Object.values(ElementType) as type }
        <button on:click={() => addElement(type)}>{type}</button>
        {/each}
      </div>
    {/if}
  </footer>


</document-builder>

<style lang="scss">
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

  footer{
		margin-top: 2rem;

    button{
      padding: .5em;
      cursor: pointer;
    }
  }
  
</style>


