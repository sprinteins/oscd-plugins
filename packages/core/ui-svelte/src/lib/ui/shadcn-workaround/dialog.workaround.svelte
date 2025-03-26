<!--
@component
THIS IS A WORKAROUND TO BE USED UNTIL THE FIX FOR THE SHADOW DOM ISSUE IS RELEASED
SEE: https://github.com/huntabyte/bits-ui/issues/828
-->

<script lang="ts">
// STORES
import { dialogStore } from '$lib/headless/stores/index.js'
// TYPES
import type { Component, SvelteComponent } from 'svelte'

let {
	class: className,
	innerComponent
}: {
	class?: string
	innerComponent:
		| Component<
				Record<string, never>,
				{
					closeCallback?: () => void
				},
				''
		  >
		| undefined
} = $props()

const InnerComponent = $derived(innerComponent)
let innerComponentRef = $state<
	| (SvelteComponent<Record<string, never>, never, never> & {
			closeCallback?: (() => void) | undefined
	  } & { $$bindings: '' })
	| null
>(null)

function handleClose() {
	innerComponentRef?.closeCallback?.()
	dialogStore.isOpen = false
}
</script>

<dialog bind:this={dialogStore.dialogRef} onclose={handleClose} id="open-scd-dialog" class={`dialog ${className ? className : ''}`} >
  <div class="dialog-box">
		{#if InnerComponent}
      <InnerComponent bind:this={innerComponentRef}/>
		{/if}
  </div>
</dialog>


<style lang="scss">
.dialog {
  /* @apply pointer-events-none invisible fixed inset-0 flex justify-center opacity-0; */
  @apply pointer-events-none fixed inset-0 m-0 grid h-full max-h-none w-full max-w-none justify-items-center p-0 opacity-0 bg-transparent text-[inherit] duration-200 ease-out;
  transition-property: transform, opacity, visibility;
  overflow-y: hidden;
  overscroll-behavior: contain;
  &:not(dialog:not(.dialog-open)),
  &::backdrop {
    background-color: #0006;
    animation: dialog-pop 0.2s ease-out;
  }
  z-index: 999;
}
:where(.dialog) {
  @apply items-center;
}
.dialog-box {
	@apply bg-background rounded-sm col-start-1 row-start-1 w-11/12 max-w-lg scale-90 transform p-6 transition duration-200 ease-out;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
  overflow-y: hidden;
  overscroll-behavior: contain;
  max-height: calc(100vh - 5em);
}

.dialog[open] {
  @apply pointer-events-auto visible opacity-100;
}

:root:has(:is(.dialog[open])) {
  @apply overflow-hidden;
  scrollbar-gutter: stable;
}

.dialog[open] .dialog-box {
  @apply translate-y-0 scale-100;
}
</style>