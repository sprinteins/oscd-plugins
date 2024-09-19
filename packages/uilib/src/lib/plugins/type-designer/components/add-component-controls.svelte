<script lang="ts">
  import Button from "@smui/button";
  import { ldNodeName, IEDNodeName, vlNodeName, bayNodeName, substationNodeName } from '../constants/type-names';
  import { EditorEventHandler } from "../editor-events/editor-event-handler";
  import { onCreateBay, onCreateIED, onCreateLDevice, onCreateSubstation, onCreateVoltageLevel } from "./event-handlers"

  export let editEventHandler: EditorEventHandler

  const buttons = [
    // { name: ldNodeName, onClick: () => onCreateLDevice(createLDEvent, editEventHandler) },
    // { name: IEDNodeName, onClick: () => onCreateIED(createBayEvent, editEventHandler) },
    // { name: vlNodeName, onClick: () => onCreateVoltageLevel(createVolEvent, editEventHandler) },
    { name: bayNodeName, onClick: () => onCreateBay(createBayEvent, editEventHandler) },
    { name: substationNodeName, onClick: () => onCreateSubstation(createSubEvent, editEventHandler) }
  ];

  // TODO remove mocks, use real

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

  let substation = {
    id: "234",
    name: "sub",
    desc: "pre-defined substation dummy, if you see me, the feature works",
  }

  let createSubEvent = new CustomEvent('CreateSubstationEvent', {
    detail: { substation },
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
