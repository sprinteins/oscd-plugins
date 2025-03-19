<script lang="ts">
    import Checkbox from '@smui/checkbox'
    import Textfield from '@smui/textfield'
    import { createEventDispatcher } from 'svelte'
    import type { SignalRow, LabelText, Label } from './types.signal-list'
    
    import { debounce } from '@/utils/'
    import { signalDndStore } from '../../../stores/signal-dnd.store'
    
    //Props
    export let idx: number;
    export let id: string;
    export let label: LabelText = {
        col1Label: { name: '', hasSuffix: false },
        col2Label: { name: '', hasSuffix: false }
    }
    export let isSelected = false
    export let column1 = ''
    export let column2 = ''
    
    
    const ONE_SECOND_IN_MS = 1000
    
    const debounceUserInput = debounce(handleInputChange, ONE_SECOND_IN_MS)
    
    const dispatch = createEventDispatcher()
    
    function handleInputChange(key: keyof SignalRow, value: string) {
        column1 = key === 'column1' ? value : column1
        column2 = key === 'column2' ? value : column2
        dispatch('update', { key, value })
    }
    
    function createSuffixForLabelIfNeeded(label: Label) {
        const { name, hasSuffix } = label
        return hasSuffix ? `Column ${idx + 1} "${name}"` : name
    }
    
    $: if (isSelected || !isSelected) {
        dispatch('update', { key: 'isSelected', value: isSelected })
    }
    
    let isDraggedOver = false;

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        isDraggedOver = true;
        signalDndStore._dropIndex.set(idx);
    };

    const handleDragLeave = (e: DragEvent) => {
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (e.currentTarget && !(e.currentTarget as HTMLElement)?.contains?.(relatedTarget)) {
            isDraggedOver = false;
        }
    };

    const handleDrop = () => {
        isDraggedOver = false;
        const { draggedIndex, dropIndex } = signalDndStore;
        if (draggedIndex === -1 || dropIndex === -1 || draggedIndex === dropIndex) return;
        dispatch('reorder', { draggedIndex, dropIndex });
        signalDndStore.handleDragEnd(idx);
    }
    </script>
    
    
    <div>
        <div class="row-container"
                role="row"
                tabindex="0"
                aria-label="Draggable signal row"
                on:dragover={handleDragOver}
                on:dragleave={handleDragLeave}>
                <div class="signal-row"
                        data-row-id={id}
                        class:dragging={signalDndStore.draggedIndex === idx}
                >
                                <div class="controls-container">
                                        <div draggable="true"
                                                role="button"
                                                tabindex="0"
                                                aria-label="Drag handle"
                                                on:dragstart={() => signalDndStore.handleDragStart(idx)}
                                                on:dragend={() => signalDndStore.handleDragEnd(idx)}>
                                                <div class="drag-handle">
                                                        <svg viewBox="0 0 24 24" width="24" height="24" class="grip-dots">
                                                                <circle cx="6" cy="6" r="2"/>
                                                                <circle cx="12" cy="6" r="2"/>
                                                                <circle cx="6" cy="12" r="2"/>
                                                                <circle cx="12" cy="12" r="2"/>
                                                                <circle cx="6" cy="18" r="2"/>
                                                                <circle cx="12" cy="18" r="2"/>
                                                        </svg>
                                                </div>
                                        </div>
                                        <Checkbox bind:checked={isSelected} />
                                </div>
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
        
        <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                        class="drop-zone"
                        class:active={isDraggedOver && signalDndStore.draggedIndex !== -1}
                        on:drop|preventDefault={handleDrop}
                        on:dragover|preventDefault
                >
                </div>
        </div>
    </div>
    
    
    <style lang="scss">
        .signal-row {
            display: grid;
            grid-template-columns: 100px repeat(2, 1fr);
            grid-gap: 1rem;
            align-items: center;
            padding: 0.5rem;
            border-radius: 4px;
            position: relative;
            & :global(.mdc-text-field__input[disabled]){
                cursor: not-allowed;
            }
        }
    
        .drag-handle {
                cursor: grab;
                opacity: 0.3;
                transition: opacity 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                
                &:active {
                        cursor: grabbing;
                }
        }
    
        .grip-dots {
                fill: currentColor;
        }
    
        .drop-zone {
                height: 0;
                margin: 0;
                opacity: 0;
                transition: all 0.2s ease;
                
                &.active {
                    height: 60px;
                    opacity: 1;
                    border: 2px dashed rgb(42, 161, 152);
                    background: rgba(42, 161, 152, 0.1);
                }
        }
    
        .controls-container {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
    </style>