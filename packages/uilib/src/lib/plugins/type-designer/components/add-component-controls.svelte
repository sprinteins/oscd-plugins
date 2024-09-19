<script lang="ts">
  import Button from "@smui/button";
  import { ldNodeName, IEDNodeName, vlNodeName, bayNodeName, substationNodeName } from '../constants/type-names';
  import { EditorEventHandler } from "../editor-events/editor-event-handler";
  import { fieldConfig } from "./field-config";
  import { handleCreateEvent } from './event-handlers';
  import type { IEDType, LDeviceType, VoltageLevelType } from "../types";
  import type { BayType, SubstationType } from "../types/nodes";

  export let editEventHandler: EditorEventHandler

  type FormData = BayType
                  | SubstationType
                  | LDeviceType
                  | IEDType
                  | VoltageLevelType
                  | null

  let showFields = false
  let entityType: string
  // TODO something like react hook form?
  let formData: FormData = null

  function handleButtonClick(type: string) {
    entityType = type;
    showFields = true;
    formData = null
  }

  function handleInputChange(event) {
    if (formData === null) {
      formData = {} as FormData;
    }
    const target = event.target as HTMLInputElement;
    formData[target.name] = target.value;
  }

  function handleSubmit() {
    if (!formData || Object.keys(formData).length === 0) {
      console.log("[!] create fehlgeschlagen");
      return;
    }
    handleCreateEvent(entityType, formData, editEventHandler);
    showFields = false;
    formData = null
  }

  const buttons = [
    { name: ldNodeName, onClick: () => handleButtonClick('CreateLDeviceEvent') },
    { name: IEDNodeName, onClick: () => handleButtonClick('CreateIEDEvent') },
    { name: vlNodeName, onClick: () => handleButtonClick('CreateBayEvent') },
    { name: bayNodeName, onClick: () => handleButtonClick('CreateVoltageLevelEvent') },
    { name: substationNodeName, onClick: () => handleButtonClick('CreateSubstationEvent') },
  ]
</script>

<div class="container">
  {#if showFields}
    <div class="input-fields">
      {#each fieldConfig[entityType] as field}
        <label for={field.name}>{field.label}:</label>
        <input type={field.type} id={field.name} name={field.name} on:input={handleInputChange} />
      {/each}
      <Button on:click={handleSubmit}>Create {entityType.replace('Create', '').replace('Event', '')}</Button>
    </div>
  {/if}
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
