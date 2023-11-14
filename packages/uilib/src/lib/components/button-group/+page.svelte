<script lang="ts">
    import ButtonGroup from "./button-group.svelte"
    import type { ButtonGroupOption } from "./types"
    import { Example } from "../internal"

    let selectedIndex = -1
    const options: ButtonGroupOption[] = [
    	{ id: "option1", label: "🍕 Pizza" },
    	{ id: "option2", label: "🍜 Noodles" },
    	{ id: "option3", label: "🍫 Chocolate" },
    ]

    function handleChange(event: CustomEvent<{ index: number }>) {
    	selectedIndex = event.detail.index
    }
</script>

<Example name="Button Group">
    <div>
        <ButtonGroup
            {options}
            {selectedIndex}
            on:change={handleChange}
            testid="button-group"
        />
    </div>
    <div>
        selected: <pre>{JSON.stringify(options[selectedIndex] ?? {})}</pre>
    </div>
</Example>

<Example name="Button Group (Disabled)">
    <div>
        <ButtonGroup
            {options}
            {selectedIndex}
            on:change={handleChange}
            disabled={true}
        />
    </div>
    <div>
        selected: <pre>{JSON.stringify(options[selectedIndex] ?? {})}</pre>
    </div>
</Example>
