<script lang="ts">
  import Button, { Label } from "@smui/button";

  interface Props {
    // Input
    handleClick?: (event: MouseEvent) => void;
    testid?: string;
    disabled?: boolean;
    componentClasses?: string;
    type?: "primary" | "secondary" | "tertiary";
    children?: import("svelte").Snippet;
  }

  let {
    handleClick,
    testid = "",
    disabled = false,
    componentClasses = "",
    type = "primary",
    children,
  }: Props = $props();

  type Variant = "text" | "raised" | "unelevated" | "outlined";
  const varianTypeMap: { [key in typeof type]: Variant } = {
    primary: "raised",
    secondary: "outlined",
    tertiary: "text",
  };

  let dataProps = $derived({
    "data-testid": testid,
  });
</script>

<Button
  class="tscd-button {componentClasses} "
  onclick={handleClick}
  {disabled}
  variant={varianTypeMap[type]}
  {...dataProps}
>
  <Label>
    {@render children?.()}
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
