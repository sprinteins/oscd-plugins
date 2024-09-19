<script lang="ts">
    import Card, { Content } from "@smui/card";

    export let componentData: { [key: string]: any }[];
    export let componentName: string;
    export let componentId: string;

    // TODO 20.09 muss weg
    function formatComponentName(name: string): string {
        if (name.endsWith("s")) {
            name = name.slice(0, -1);
        }
        name = name
            .split(/(?=[A-Z])/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        return name;
    }
</script>

<Card>
    <Content>
        {formatComponentName(componentName)} #{componentId}
        <br />
        {#each componentData as { key, value }}
            {#if typeof value !== "object" && value}
                {key}: {value}
                <br />
            {/if}
        {/each}
    </Content>
</Card>
