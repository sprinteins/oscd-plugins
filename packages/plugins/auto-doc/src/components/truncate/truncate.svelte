<script lang="ts">
import { Tooltip } from '@/components'
import type { TooltipPosition } from '@/components/tooltip/types.tooltip'

export let text = ''
export let maxChars = 50
export let tooltipPosition: TooltipPosition = 'top'
export let tooltipDelayInMS = 300

let isTextToBeTruncated = text.length > maxChars
let truncatedText = isTextToBeTruncated ? `${text.slice(0, maxChars)}...` : text
</script>
  
  {#if isTextToBeTruncated}
    <Tooltip text={text} position={tooltipPosition} delayInMS={tooltipDelayInMS}>
      <span>{truncatedText}</span>
    </Tooltip>
  {:else}
    <span>{text}</span> 
  {/if}
  