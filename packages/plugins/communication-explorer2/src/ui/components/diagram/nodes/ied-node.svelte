<script lang="ts">
import { type NodeProps, Handle, Position } from '@xyflow/svelte'
import type { IEDNodeData } from '@/headless/stores/diagram/types'

// Extract node properties using Svelte 5 props rune
const { id, data, selected } = $props<{
	id: NodeProps['id']
	data: NodeProps['data']
	selected: NodeProps['selected']
}>()

// Cast data to our expected type using runes
const iedData = $derived(data as IEDNodeData)
const isRelevant = $derived(iedData.isRelevant !== false)
const opacity = $derived(isRelevant ? '1' : '0.5')
const bayList = $derived(
	iedData.bays ? Array.from(iedData.bays).join(', ') : ''
)
const showBayInfo = $derived(!!bayList)
</script>

<div 
  class="ied-node {selected ? 'selected' : ''}" 
  style="opacity: {opacity};"
>
  <!-- Left side handles for inputs -->
  <Handle 
    type="target"
    position={Position.Left}
    style="width: 8px; height: 8px; top: 50%;"
  />
  
  <div class="ied-content">
    <div class="ied-name" title={iedData.iedName}>
      {iedData.iedName}
    </div>
    
    {#if showBayInfo}
      <div class="ied-bay" title="Bay: {bayList}">
        <span class="bay-icon">⚡</span> {bayList}
      </div>
    {/if}
  </div>
  
  <!-- Right side handles for outputs -->
  <Handle 
    type="source"
    position={Position.Right}
    style="width: 8px; height: 8px; top: 50%;"
  />
</div>

<style>
  .ied-node {
    padding: 10px;
    border-radius: 4px;
    background: white;
    border: 1px solid #ccc;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 12px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: all 0.2s ease;
  }
  
  .ied-node.selected {
    border: 2px solid #3498db;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.5);
  }
  
  .ied-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
  }
  
  .ied-name {
    font-weight: bold;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .ied-bay {
    font-size: 10px;
    color: #777;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 4px;
  }
  
  .bay-icon {
    font-size: 8px;
  }
</style>
