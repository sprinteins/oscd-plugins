<script lang="ts">
  import Button from "@smui/button";
  import { ldNodeName, IEDNodeName, vlNodeName, bayNodeName, substationNodeName } from '../constants/type-names';

  export let onClick: (event: CustomEvent) => void;

  const buttons = [
    { name: ldNodeName, onClick: () => onClick(createBayEvent) },
    { name: IEDNodeName, onClick: () => console.log("onAddIed") },
    { name: vlNodeName, onClick: () => console.log("onAddVL") },
    { name: bayNodeName, onClick: () => console.log("onAddBay") },
    { name: substationNodeName, onClick: () => console.log("onAddSub") }
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
