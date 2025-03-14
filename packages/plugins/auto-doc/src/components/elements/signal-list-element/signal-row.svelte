<script lang="ts">
import Checkbox from '@smui/checkbox'
import Textfield from '@smui/textfield'
import { createEventDispatcher } from 'svelte'
import type { SignalRow, LabelText, Label } from './types.signal-list'

import { debounce } from '@/utils/'
import { signalDndStore } from '../../../stores/signal-dnd.store'

//Props
export let idx = 1
export let label: LabelText = {
	col1Label: { name: '', hasSuffix: false },
	col2Label: { name: '', hasSuffix: false }
}
export let isSelected = false
export let column1 = ''
export let column2 = ''

let areAllCheckboxesSelected = false

const ONE_SECOND_IN_MS = 1000

const debounceUserInput = debounce(handleInputChange, ONE_SECOND_IN_MS)

const dispatch = createEventDispatcher()

function handleInputChange(key: keyof SignalRow, value: string) {
	column1 = key === 'column1' ? value : column1
	column2 = key === 'column2' ? value : column2
	dispatch('update', { key, value })
}

function isFirstRow() {
	return idx === 0
}

function createSuffixForLabelIfNeeded(label: Label) {
	const { name, hasSuffix } = label
	return hasSuffix ? `Column ${idx + 1} "${name}"` : name
}

$: if (isSelected || !isSelected) {
	dispatch('update', { key: 'isSelected', value: isSelected })
}

function toggleAllCheckboxes() {
	dispatch('toggleAllCheckboxes', { value: areAllCheckboxesSelected })
}

$: isDropTarget =
	signalDndStore.draggedIndex !== -1 && signalDndStore.dropIndex === idx

$: console.log(
	'Row',
	idx,
	'isDropTarget:',
	isDropTarget,
	'draggedIndex:',
	signalDndStore.draggedIndex,
	'dropIndex:',
	signalDndStore.dropIndex
)

function handleDrop(event: Event, index: number) {
	// console.log('handleDrop', {
	// 	idx: idx,
	// 	draggedIndex: signalDndStore.draggedIndex,
	// 	dropIndex: signalDndStore.dropIndex
	// })

	const { draggedIndex } = signalDndStore
	// if (draggedIndex === -1 || dropIndex === -1 || draggedIndex === dropIndex) {
	// 	return
	// }

	dispatch('reorder', { draggedIndex, dropIndex: index })
	// signalDndStore.handleDragEnd()
	console.log(event)
	console.log(index)
}

// let dragged

// /* events fired on the draggable target */
// const source = document.getElementById('draggable')
// source?.addEventListener('drag', (event) => {
// 	console.log('dragging')
// })

// source?.addEventListener('dragstart', (event) => {
// 	// store a ref. on the dragged elem
// 	dragged = event.target
// 	// make it half transparent
// 	event.target.classList.add('dragging')
// })

// source?.addEventListener('dragend', (event) => {
// 	// reset the transparency
// 	event.target.classList.remove('dragging')
// })

// /* events fired on the drop targets */
// const target = document.getElementById('drop-target')
// target?.addEventListener(
// 	'dragover',
// 	(event) => {
// 		// prevent default to allow drop
// 		event.preventDefault()
// 	},
// 	false
// )

// target?.addEventListener('dragenter', (event) => {
// 	// highlight potential drop target when the draggable element enters it
// 	if (event.target?.classList.contains('dropzone')) {
// 		event.target.classList.add('dragover')
// 	}
// })

// target?.addEventListener('dragleave', (event) => {
// 	// reset background of potential drop target when the draggable element leaves it
// 	if (event.target?.classList.contains('dropzone')) {
// 		event.target.classList.remove('dragover')
// 	}
// })

// target?.addEventListener('drop', (event) => {
// 	// prevent default action (open as link for some elements)
// 	event.preventDefault()
// 	// move dragged element to the selected drop target
// 	if (event.target?.classList.contains('dropzone')) {
// 		event.target.classList.remove('dragover')
// 		event.target.appendChild(dragged)
// 	}
// })
</script>
    
    
    <div>
    <div class="signal-row" 
        class:dragging={signalDndStore.draggedIndex === idx}
    >
        {#if isFirstRow()}
                <div>
                        <div></div>
                        <div>
                                <Checkbox 
                                        on:click={toggleAllCheckboxes}
                                        bind:checked={areAllCheckboxesSelected}
                                />
                        </div>
                        <small>Choose the columns you want to display and rename if needed</small>
                        <small>Use the filter to limit the content of the columns to certain values</small>
                </div>
        {/if}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        
        <div draggable="true"
                on:dragstart={() => signalDndStore.handleDragStart(idx)}
                on:dragend={() => signalDndStore.handleDragEnd(idx)}
        >
                <div 
                        class="drag-handle"
                >
                        <svg viewBox="0 0 24 24" width="24" height="24" class="grip-dots">
                                <circle cx="6" cy="6" r="2"/>
                                <circle cx="12" cy="6" r="2"/>
                                <circle cx="6" cy="12" r="2"/>
                                <circle cx="12" cy="12" r="2"/>
                                <circle cx="6" cy="18" r="2"/>
                                <circle cx="12" cy="18" r="2"/>
                        </svg>
                </div>
                <Checkbox bind:checked={isSelected} />
                <Textfield
                        bind:value={column1}
                        variant="outlined"
                        label={createSuffixForLabelIfNeeded(label.col1Label)}
                        on:input= {e => debounceUserInput('column1', e.target.value)}
                        disabled={!isSelected}
                        >
                </Textfield>
                <Textfield
                        bind:value={column2}
                        variant="outlined"
                        label={createSuffixForLabelIfNeeded(label.col2Label)}
                        on:input= {e => debounceUserInput('column2', e.target.value)}
                        disabled={!isSelected}
                        >
                </Textfield>
        </div>
    </div>
    
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="drop-zone"
        on:dragover|preventDefault
        on:drop|preventDefault={(event) => handleDrop(event, idx)}
    >
    </div>
    </div>
    
    
    <style lang="scss">
        .signal-row {
                display: grid;
                grid-template-columns: auto 3% repeat(2, 1fr);
                grid-gap: 1rem;
                align-items: center;
                padding: 0.5rem;
                border: 1px solid #ff0000;
                border-radius: 4px;
                background: white;
                position: relative;
                
                &.dragging {
                        opacity: 0.5;
                }
    
                &:hover .drag-handle {
                        opacity: 1;
                }
    
                & :global(.mdc-text-field__input[disabled]) {
                        cursor: not-allowed;
                }
    
                small {
                        color: #4d5d63;
                        text-align: center;
                }
        }
    
        .drag-handle {
                cursor: grab;
                opacity: 0.3;
                transition: opacity 0.2s;
                display: flex;
                align-items: center;
                
                &:active {
                        cursor: grabbing;
                }
        }
    
        .grip-dots {
                fill: currentColor;
        }
    
        .drop-zone {
                height: 60px;
                width: 100%;
                border: 1px dashed #00ff00;
                // &.active {
                // 		height: 60px;
                // 		border: 2px dashed #00ff00;
                // 		background: rgba(0, 255, 0, 0.1);
                // }
    
                // &:hover {
                // 		background: rgba(255, 0, 0, 1);
                // }
        }
    </style>