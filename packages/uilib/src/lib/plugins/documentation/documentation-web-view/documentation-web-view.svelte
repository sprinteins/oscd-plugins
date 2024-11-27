<script lang="ts">
  import { PdfType, exportPdfInNewTab } from "."
  import InformationCard from "../../../components/information-card/information-card.svelte"
</script>

<section class="documentation-web-content">
  <div class="pdf-downloads">
    <InformationCard on:buttonClick={() => exportPdfInNewTab(PdfType.Telegram)}>
      <span slot="header">Communication Explorer</span>
      <span slot="description"
        >Downloading the Communication Explorer including an overview about the
        whole network</span
      >
      <span slot="button-text">Download</span>
    </InformationCard>
    <InformationCard
      on:buttonClick={() => exportPdfInNewTab(PdfType.Documentation)}
    >
      <span slot="header">Documentation</span>
      <span slot="description"
        >Copy Download the Documentation including a list with all busses, bays,
        Intelligent Electronic Device IEDs, Logical Nodes (LNs), Data Attributes
        (DAs), Data Objects (DOs) and Enumerations (ENUMs).</span
      >
      <span slot="button-text">Download</span>
    </InformationCard>
  </div>
</section>

<style>
  .pdf-downloads {
    margin: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media print {
    .documentation-web-content {
      display: none;
    }
  }
</style>
