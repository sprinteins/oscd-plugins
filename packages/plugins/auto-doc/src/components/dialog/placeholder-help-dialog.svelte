<script lang="ts">
    import Dialog, { Title, Content, Actions } from "@smui/dialog";
    import Button, { Label } from "@smui/button";

    interface Props {
        isOpen?: boolean;
    }

    let { isOpen = $bindable(false) }: Props = $props();
</script>

<Dialog
    bind:open={isOpen}
    aria-labeledby="placeholder-help-dialog-title"
    aria-describedby="placeholder-help-dialog-content"
>
    <Title id="placeholder-help-dialog-title">XPath Help</Title>
    <Content id="placeholder-help-dialog-content">
        Placeholders are created by placing XPath expressions within two curly braces:<br><br>
        <code>
            //default:Name[index]/@attribute
        </code>

        <ul>
            <li>
                <code>//default</code>: Namespace, leave it as is for default
            </li>
            <li>
                <code>Name</code>: Name of the element, like Substation, LNode, Function, Bay, etc.
            </li>
            <li>
                <code>index</code>(optional): Which element to select
            </li>
            <li>
                <code>attribute</code>: Select all elements with that attribute
            </li>
        </ul>

        <br>
        Examples:
        <ul>
            <li>
                Get the names of all Substations: <br>
                <code>//default:Substation/@name</code>
            </li> 
            <li>
                Get the name of the first Bay: <br>
                <code>//default:Bay[1]/@name</code>
            </li>
            <li>
                Get all LNodes that have a specific <code>iedName</code>:<br>
                <code>//default:LNode[@iedName="NWHEI_C1_Q01_MU1"]</code>
            </li>
        </ul>
        <Actions>
            <Button>
                <Label>Got it</Label>
            </Button>
        </Actions>
    </Content>
</Dialog>

<style>
    code {
        background: #F2EBDE;
        color: #515F7A;

        font-size: 14px;

        padding: 4px;
        border-radius: 4px;
    }

    ul {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
</style>
