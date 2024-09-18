<script lang="ts">
  import Button from "@smui/button";

  export let onClick: (event: CustomEvent) => void;

  let Bay = {
    id: "234",
    name: "dummy",
    desc: "pre-defined dummy, if you see me, the feature works",
  }

  let createBayEvent = new CustomEvent('CreateBayEvent', {
    detail: { Bay },
    bubbles: true,
    composed: true
  });
</script>

<div class="container">
  <Button on:click={() => onClick(createBayEvent)}>Add LN</Button>
  <Button on:click={() => console.log("here")}>Add LD</Button>
  <Button>Add IED</Button>
  <Button>Add Bay</Button>
</div>

<style>
    .container {
      position: fixed;
      bottom: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
      padding: 16px;
    }
</style>
