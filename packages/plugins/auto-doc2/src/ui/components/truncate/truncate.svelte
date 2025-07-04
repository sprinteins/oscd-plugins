<script lang="ts">
    import {Tooltip} from '@/ui/components';
    import type {TooltipPosition} from "@/ui/components/tooltip/types.tooltip"

  
  interface Props {
    text?: string;
    maxChars?: number;
    tooltipPosition?: TooltipPosition;
    tooltipDelayInMS?: number;
  }

  let {
    text = '',
    maxChars = 50,
    tooltipPosition = 'top',
    tooltipDelayInMS = 300
  }: Props = $props();
  

    let isTextToBeTruncated = text.length > maxChars;
    let truncatedText = isTextToBeTruncated ? `${text.slice(0, maxChars)}...` : text;
  </script>
  
  {#if isTextToBeTruncated}
    <Tooltip text={text} position={tooltipPosition} delayInMS={tooltipDelayInMS}>
      <span>{truncatedText}</span>
    </Tooltip>
  {:else}
    <span>{text}</span> 
  {/if}
  