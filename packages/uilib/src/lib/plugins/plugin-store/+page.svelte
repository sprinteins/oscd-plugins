<script lang="ts">
    import { PluginStore } from ".";
    import { xmlStr } from "../../../test-files/simple_v5";
    import { Example } from "../../components/internal";

    const parser = new DOMParser();
    const doc = parser.parseFromString(
        xmlStr,
        "text/xml",
    ) as unknown as Element;
</script>

<Example name="PluginStore">
    <PluginStore root={doc} />
</Example>
