<script lang="ts">
  interface Props {
    checked?: boolean;
    label: string;
    testid?: string;
    onchange?: (e: Event) => void;
    oninput?: (e: Event) => void;
  }

  let {
    onchange,
    oninput,
    checked = $bindable(false),
    label,
    testid = "",
  }: Props = $props();
</script>

<div class="checkbox" data-testid={testid}>
  <label>
    <input type="checkbox" {onchange} {oninput} bind:checked />
    <span class="checkbox">{label}</span>
  </label>
</div>

<style>
  .checkbox {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    accent-color: var(--color-accent);
  }
</style>
