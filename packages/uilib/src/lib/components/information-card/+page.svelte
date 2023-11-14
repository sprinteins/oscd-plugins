<script lang="ts">
  import { PdfType } from "../../plugins/documentation/documentation-web-view"
  import { Example } from "../internal"
  import InformationCard from "./information-card.svelte"

  function downloadPdf(e: CustomEvent, type: PdfType) {
  	alert(`Print ${type}`)
  }
</script>

<Example name="Download Communication-Explorer">
  <div class="pdf-downloads">
    <InformationCard on:buttonClick={(e) => downloadPdf(e, PdfType.Telegram)}>
      <span slot="header">Communication Explorer</span>
      <span slot="description"
        >Downloading the Communication Explorer including an overview about the
        whole network</span
      >
      <span slot="button-text">Download</span>
    </InformationCard>
  </div></Example
>
<Example name="Download Documentation">
  <InformationCard
    on:buttonClick={(e) => downloadPdf(e, PdfType.Documentation)}
  >
    <span slot="header">Documentation</span>
    <span slot="description"
      >Copy Download the Documentation including a list with all busses, bays,
      Intelligent Electronic Device IEDs, Logical Nodes (LNs), Data Attributes
      (DAs), Data Objects (DOs) and Enumerations (ENUMs).</span
    >
    <span slot="button-text">Download</span>
  </InformationCard>
</Example>
