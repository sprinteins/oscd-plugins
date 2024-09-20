<script lang="ts">
    import Card, { Content } from "@smui/card";

    export let componentData: { [key: string]: any }[];
    export let componentName: string;
    export let componentId: string;
</script>

<Card>
    <Content>
        {componentName} #{componentId}
        <br />
        {#each componentData as { key, value }}
            {#if typeof value !== "object" && value}
                {key}: {value}
                <br />
            {/if}
        {/each}
    </Content>
</Card>
