<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  import './button.css';

  

  
  
  
  interface Props {
    /**
   * Is this the principal call to action on the page?
   */
    primary?: boolean;
    /**
   * What background color to use
   */
    backgroundColor?: string | undefined;
    /**
   * How large should the button be?
   */
    size?: 'small' | 'medium' | 'large';
    /**
   * Button contents
   */
    label?: string;
  }

  let {
    primary = false,
    backgroundColor = undefined,
    size = 'medium',
    label = ''
  }: Props = $props();

  let mode = $derived(primary ? 'storybook-button--primary' : 'storybook-button--secondary');

  let style = $derived(backgroundColor ? `background-color: ${backgroundColor}` : '');
</script>

<button
  type="button"
  class={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
  {style}
  onclick={bubble('click')}
>
  {label}
</button>
