<script lang="ts">
  import Button, { Label } from "@smui/button"

  // Input
  export let testid = ""
  export let disabled = false
  export let componentClasses = ""
  export let type: "primary" | "secondary" | "tertiary" = "primary"

  type Variant = "text" | "raised" | "unelevated" | "outlined";
  const varianTypeMap: { [key in typeof type]: Variant } = {
  	primary:   "raised",
  	secondary: "outlined",
  	tertiary:  "text",
  }

  $: dataProps = {
  	"data-testid": testid,
  }
</script>

<Button
  class="tscd-button {componentClasses} "
  on:click
  {disabled}
  variant={varianTypeMap[type]}
  {...dataProps}
>
  <Label>
    <slot />
  </Label>
</Button>

<style lang="scss">
  :global(button.tscd-button) {
    --padding: 0.5rem;
    width: auto;
    height: auto;
    padding: var(--padding) calc(var(--padding) * 2);
  }
</style>
