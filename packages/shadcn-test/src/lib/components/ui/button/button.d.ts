import type { buttonVariants } from './button.svelte'

import type { WithElementRef } from 'bits-ui'
import type {
	HTMLAnchorAttributes,
	HTMLButtonAttributes
} from 'svelte/elements'
import type { VariantProps } from 'tailwind-variants'

export type ButtonVariant = VariantProps<typeof buttonVariants>['variant']
export type ButtonSize = VariantProps<typeof buttonVariants>['size']

export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
	WithElementRef<HTMLAnchorAttributes> & {
		variant?: ButtonVariant
		size?: ButtonSize
	}
