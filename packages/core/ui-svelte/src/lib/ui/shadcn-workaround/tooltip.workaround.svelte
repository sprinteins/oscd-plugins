<!--
@component
THIS IS A WORKAROUND TO BE USED UNTIL THE FIX FOR THE SHADOW DOM ISSUE IS RELEASED
SEE: https://github.com/huntabyte/bits-ui/issues/828
-->

<script lang="ts">
// TYPES
import type { Snippet } from 'svelte'
let {
	position,
	text,
	variant,
	class: className,
	children
}: {
	position?: 'top' | 'bottom' | 'left' | 'right'
	variant?: 'popover' | 'primary' | 'secondary' | 'accent' | 'destructive'
	text: string
	class?: string
	children: Snippet
} = $props()

const positionClass = $derived.by(() => {
	switch (position) {
		case 'top':
			return 'tooltip-top'
		case 'bottom':
			return 'tooltip-bottom'
		case 'left':
			return 'tooltip-left'
		case 'right':
			return 'tooltip-right'
		default:
			return 'tooltip-top'
	}
})

const variantClass = $derived.by(() => {
	switch (variant) {
		case 'primary':
			return 'tooltip-primary'
		case 'secondary':
			return 'tooltip-secondary'
		case 'accent':
			return 'tooltip-accent'
		case 'destructive':
			return 'tooltip-destructive'
		case 'popover':
			return 'tooltip-popover'
		default:
			return 'tooltip-popover'
	}
})
</script>

<div class={`${positionClass} ${variantClass} tooltip ${className}`} data-tip={text}>
  {@render children()}
</div>

<style lang="scss">
.tooltip {
  @apply relative inline-block text-center;
  --tooltip-tail: 0.1875rem;
  --tooltip-tail-offset: calc(100% + 0.0625rem - var(--tooltip-tail));
	--tooltip-offset: calc(100% + 1px + var(--tooltip-tail, 0px));
}
.tooltip:before {
  @apply absolute;
  pointer-events: none;
  z-index: 1;
}
.tooltip:before {
  content: var(--tw-content);
  --tw-content: attr(data-tip);
}
.tooltip:before,
.tooltip:after {
  @apply opacity-0 transition delay-100 duration-200 ease-in-out;
}
.tooltip:after {
  @apply absolute;
}
.tooltip:before {
  @apply max-w-xs rounded px-2 py-1 text-sm whitespace-normal;
  background-color: var(--tooltip-color);
  color: var(--tooltip-text-color);
  width: max-content;
}
.tooltip:hover:before {
  @apply opacity-100 delay-75;
}
.tooltip:hover:after {
  @apply opacity-100 delay-75;
}
.tooltip:has(:focus-visible):after,
.tooltip:has(:focus-visible):before {
  @apply opacity-100 delay-75;
}
.tooltip:not([data-tip]):hover:before,
.tooltip:not([data-tip]):hover:after {
  visibility: hidden;
  opacity: 0;
}

.tooltip:after {
  content: "";
  border-style: solid;
  border-width: var(--tooltip-tail, 0);
  width: 0;
  height: 0;
  display: block;
  position: absolute;
}
.tooltip,
.tooltip-top {
	&:before {
    transform: translateX(-50%);
    top: auto;
    left: 50%;
    right: auto;
    bottom: var(--tooltip-offset);
  }
  &:after {
    transform: translateX(-50%);
    border-color: var(--tooltip-color) transparent transparent transparent;
    top: auto;
    left: 50%;
    right: auto;
    bottom: var(--tooltip-tail-offset);
  }
}
.tooltip-bottom {
	&:before {
    transform: translateX(-50%);
    top: var(--tooltip-offset);
    left: 50%;
    right: auto;
    bottom: auto;
  }
  &:after {
    transform: translateX(-50%);
    border-color: transparent transparent var(--tooltip-color) transparent;
    top: var(--tooltip-tail-offset);
    left: 50%;
    right: auto;
    bottom: auto;
  }
}
.tooltip-left {
	&:before {
    transform: translateY(-50%);
    top: 50%;
    left: auto;
    right: var(--tooltip-offset);
    bottom: auto;
  }
  &:after {
    transform: translateY(-50%);
    border-color: transparent transparent transparent var(--tooltip-color);
    top: 50%;
    left: auto;
    right: calc(var(--tooltip-tail-offset) + 0.0625rem);
    bottom: auto;
  }
}
.tooltip-right {
	&:before {
    transform: translateY(-50%);
    top: 50%;
    left: var(--tooltip-offset);
    right: auto;
    bottom: auto;
  }
  &:after {
    transform: translateY(-50%);
    border-color: transparent var(--tooltip-color) transparent transparent;
    top: 50%;
    left: calc(var(--tooltip-tail-offset) + 0.0625rem);
    right: auto;
    bottom: auto;
  }
}
.tooltip {
	&-popover {
		--tooltip-color: theme(colors.muted.DEFAULT);
		--tooltip-text-color: theme(colors.muted.foreground);
	}
  &-primary {
    --tooltip-color: theme(colors.primary.DEFAULT);
    --tooltip-text-color: theme(colors.primary.foreground);
  }
  &-secondary {
    --tooltip-color: theme(colors.secondary.DEFAULT);
    --tooltip-text-color: theme(colors.secondary.foreground);
  }
  &-accent {
    --tooltip-color: theme(colors.accent.DEFAULT);
    --tooltip-text-color: theme(colors.accent.foreground);
  }
  &-destructive {
    --tooltip-color: theme(colors.destructive.DEFAULT);
    --tooltip-text-color: theme(colors.destructive.foreground);
  }
}
</style>