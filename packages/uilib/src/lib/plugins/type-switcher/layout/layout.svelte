<script lang="ts">
</script>

<layout>
  <div class="columns">
    <div class="collective">
      <h5 class="mdc-typography--headline5">Duplicates</h5>
      <slot class="category-selector" name="category-selector" />
      <slot class="group-card-list" name="group-card-list" />
    </div>
    <div class="panel">
      <h5 class="mdc-typography--headline5">Duplicates Types</h5>
      <slot name="type-linker" />
    </div>
    <div class="panel">
      <h5 class="mdc-typography--headline5">Affected Nodes</h5>
      <slot name="affected-nodes" />
    </div>
    <div class="panel">
      <h5 class="mdc-typography--headline5">Structure</h5>
      <slot name="structure" />
    </div>
  </div>
</layout>

<style>
  .collective {
    display: grid;
    grid-template-rows: auto auto 1fr;
  }

  h5.mdc-typography--headline5 {
    margin: 16px 0;
    font-size: 14px;
    margin-top: 0.5rem;
    padding-bottom: 1rem;
    margin-left: 1rem;
  }

  .columns {
    --magic-number: 510px;
    height: 100%;
    overflow: hidden;
    display: grid;
    grid-template-columns: 2.5fr 1.5fr 2fr 2fr;
    gap: 1rem;
  }
  .columns > div {
    padding: 0.5rem;
    height: 100%;
    overflow: hidden;
  }

  .panel {
    height: 100%;
    background: var(--mdc-theme-surface);
    display: grid;
    grid-template-rows: auto 1fr;
    overflow: hidden;
  }
</style>
