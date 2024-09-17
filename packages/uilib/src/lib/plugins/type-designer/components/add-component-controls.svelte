<script lang="ts">
  import Button from "@smui/button";
  import { type CreateBayEvent } from "../editor-events/event-types";
    import { type BayTypeElement } from "@oscd-plugins/core";

  export let onClick: (event: CustomEvent) => void;

  let dummy = {
    id: "1",
    name: "something",
    desc: "new"
  }

  let createBayEvent = new CustomEvent('CreateBayEvent', {
    detail: {
      ...dummy
    },
    bubbles: true,
    composed: true
});

  function onClickNothing() {
    console.log("onClick");
  }
</script>

<div class="container">
  <Button on:click={() => onClick(createBayEvent)}>Add LN</Button>
  <Button on:click={onClickNothing}>Add LD</Button>
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
