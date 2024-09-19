<script lang="ts">
  import Button from "@smui/button";

  export let onClick: (event: CustomEvent) => void;

  const buttons = [
    { name: "Add LD", onClick: () => onClick(createBayEvent) },
    { name: "Add IED", onClick: () => console.log("onAddIed") },
    { name: "Add Voltage Level", onClick: () => console.log("onAddVL") },
    { name: "Add Bay", onClick: () => console.log("onAddBay") },
    { name: "Add Substation", onClick: () => console.log("onAddSub") }
  ];

  let bay = {
    id: "234",
    name: "dummy",
    desc: "pre-defined dummy, if you see me, the feature works",
  }

  let createBayEvent = new CustomEvent('CreateBayEvent', {
    detail: { bay },
    bubbles: true,
    composed: true
  });
</script>

<div class="container">
  {#each buttons as { name, onClick }}
    <Button on:click={onClick}>{name}</Button>
  {/each}
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
