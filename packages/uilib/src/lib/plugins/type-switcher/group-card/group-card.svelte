<script lang="ts">
  import { Counter } from "../../../components/counter"
  import { Icons, type IconKeys } from "../../../components/icons"

  // Input
  export let items: string[] = []
  export let icon: IconKeys | undefined
  export let dataTestid = ""
  export let selected = false

  // Internal
  const MAX_NR_OF_ITEMS = 3
  $: displayedItems = items.slice(0, MAX_NR_OF_ITEMS)
  $: titleText = items.join("\n")
</script>

<group-card
  on:click
  on:keypress
  data-testid={dataTestid}
  class:selected
  title={titleText}
>
  <div class="left">
    {#if icon}
      <div class="icon-placeholder">
        <Icons name={icon} size="rect" />
      </div>
    {:else}{/if}
    <ul>
      {#each displayedItems as item}
        <li>{item}</li>
      {/each}
    </ul>
  </div>
  <span class="right">
    <Counter count={items.length} />
  </span>
</group-card>

<style lang="scss">
  group-card {
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
