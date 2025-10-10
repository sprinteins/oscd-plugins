<script lang="ts">
  import { Counter } from "@oscd-plugins/ui";
  import { Icons, type IconKeys } from "@oscd-plugins/ui";

  interface Props {
    // Input
    click: (event: Event) => void;
    items?: string[];
    icon: IconKeys | undefined;
    dataTestid?: string;
    selected?: boolean;
  }

  let {
    click,
    items = [],
    icon,
    dataTestid = "",
    selected = false,
  }: Props = $props();

  // Internal
  const MAX_NR_OF_ITEMS = 3;
  let displayedItems = $derived(items.slice(0, MAX_NR_OF_ITEMS));
  let titleText = $derived(items.join("\n"));
</script>

<!-- TODO - Is this needed?-->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  class="group-card"
  onclick={(e) => click(e)}
  data-testid={dataTestid}
  class:selected
  title={titleText}
>
  <div class="left">
    {#if icon}
      <div class="icon-placeholder">
        <Icons name={icon} size="rect" />
      </div>
    {:else}
      {null}
    {/if}
    <ul>
      {#each displayedItems as item}
        <li>{item}</li>
      {/each}
    </ul>
  </div>
  <span class="right">
    <Counter count={items.length} />
  </span>
</div>

<style lang="scss">
  .group-card {
    display: inline-grid;

    cursor: pointer;
    height: 90px;
    padding: 0rem;

    background: var(--mdc-theme-surface);

    grid-template-columns: 1fr min(3rem);

    transition: all 100ms;
    box-sizing: border-box;

    border: transparent 1px solid;
    border-radius: 0.5rem;

    &.selected {
      border-color: var(--mdc-theme-primary);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    &:hover:not(.selected) {
      /* background: var(--color-beige-3); */
      border-style: dashed;
      border-color: var(--mdc-theme-primary);
    }

    .left {
      padding: 0.5rem 0 0.5rem 0.75rem;

      overflow: hidden;
    }

    .right {
      padding: 0.5rem;
    }

    ul {
      padding: 0;
      margin: 0;
    }

    li {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .icon-placeholder {
      padding-bottom: 0.2rem;
      //margin-top: 0.5rem;
    }
  }
</style>
