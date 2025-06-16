<script lang="ts">
import PlaceholderHelpDialog from '@/components/dialog/placeholder-help-dialog.svelte'
import Tooltip from '@/components/tooltip/tooltip.svelte'
import { debounce } from '@/utils'
import CustomIconButton from '@oscd-plugins/ui/src/components/smui-wrapper/custom-icon-button.svelte'
import Button from '@oscd-plugins/uilib/src/lib/components/button/button.svelte'
import { Group } from '@smui/button'
import { Editor } from '@tiptap/core'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { onDestroy, onMount } from 'svelte'

let element: Element
let editor: Editor
export let content = '<p>Hello World! 🌍️ </p>'
export let onContentChange: (newContent: string) => void

$: isPlaceholderHelpDialogOpen = false

const ONE_SECOND_IN_MS = 1000
const debouncedContentChange = debounce(onContentChange, ONE_SECOND_IN_MS)

onMount(() => {
	editor = new Editor({
		element: element,
		extensions: [
			TextStyle.configure({ types: [ListItem.name] }),
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3]
				}
			}),
			Underline
		],
		content: content,
		autofocus: true,
		onUpdate: ({ editor }) => {
			debouncedContentChange(editor.getHTML())
		},
		onTransaction: () => {
			// force re-render so `editor.isActive` works as expected
			editor = editor
		}
	})
})
onDestroy(() => {
	if (editor) {
		editor.destroy()
	}
})

function insertPlaceholder() {
	const cursorPosition = editor.state.selection.$anchor.pos
	editor.commands.insertContent('{{ //default: }}')
	editor
		.chain()
		.focus()
		.setTextSelection(cursorPosition + 13)
		.run()
}
</script>

<PlaceholderHelpDialog bind:isOpen={isPlaceholderHelpDialogOpen}/>

{#if editor}
    <div class="control-group">
        <div class="text-controls">
            <Group>
                <Button
                    on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    type={editor.isActive("heading", { level: 1 }) ? "primary" : "secondary"}
                >
                    H1
                </Button>
                <Button
                    on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    type={editor.isActive("heading", { level: 2 }) ? "primary" : "secondary"}
                >
                    H2
                </Button>
                <Button
                    on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    type={editor.isActive("heading", { level: 3 }) ? "primary" : "secondary"}
                >
                    H3
                </Button>
            </Group>
            <div class="button-group">
                <Tooltip text="Bold">
                    <CustomIconButton
                        on:click={() => editor.chain().focus().toggleBold().run()}
                        size="small"
                        disabled={!editor.can().chain().focus().toggleBold().run()}
                        color={editor.isActive("bold") ? "black" : "primary"}
                        icon="bold"
                    />
                </Tooltip>
                <Tooltip text="Italic">
                    <CustomIconButton
                        on:click={() => editor.chain().focus().toggleItalic().run()}
                        size="small"
                        disabled={!editor.can().chain().focus().toggleItalic().run()}
                        color={editor.isActive("italic") ? "black" : "primary"}
                        icon="italic"
                    />
                </Tooltip>
                <Tooltip text="Paragraph">
                    <CustomIconButton
                        on:click={() => editor.chain().focus().setParagraph().run()}
                        size="small"
                        color={editor.isActive("paragraph") ? "black" : "primary"}
                        icon="paragraph"
                    />
                </Tooltip>
                <Tooltip text="Bullet&nbsp;List">
                    <CustomIconButton
                        on:click={() => editor.chain().focus().toggleBulletList().run()}
                        size="small"
                        color={editor.isActive("bulletList") ? "black" : "primary"}
                        icon="bullet_list"
                    />
                </Tooltip>
                <Tooltip text="Numbered&nbsp;List">
                    <CustomIconButton
                        on:click={() => editor.chain().focus().toggleOrderedList().run()}
                        size="small"
                        color={editor.isActive("orderedList") ? "black" : "primary"}
                        icon="numbered_list"
                    />
                </Tooltip>
                <Tooltip text="Insert&nbsp;Placeholder">
                    <CustomIconButton
                        on:click={insertPlaceholder}
                        size="small"
                        color={"primary"}
                        icon="data_object"
                    />
                </Tooltip>
                <Tooltip text="Placeholder&nbsp;Help">
                    <CustomIconButton 
                        on:click={() => isPlaceholderHelpDialogOpen = true}
                        size="small" 
                        color="primary" 
                        icon="help" 
                    />
                </Tooltip>
                <Tooltip text="Undo">
                    <CustomIconButton
                        on:click={() => editor.chain().focus().undo().run()}
                        size="small"
                        color="primary"
                        icon="undo"
                    />
                </Tooltip>
                <Tooltip text="Redo">
                    <CustomIconButton
                    on:click={() => editor.chain().focus().redo().run()}
                    size="small"
                    color="primary"
                    icon="redo"
                    />
                </Tooltip>
            </div>
        </div>
    </div>
{/if}
<div class="typing-area" bind:this={element} />

<style lang="scss">
    .text-controls {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .button-group {
        display: flex;
    }

    * :global(.tooltip-container) {
        display: flex;
    }

    .placeholder-controls {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    button.is-active {
        background-color: black;
        color: white;
    }
    :first-child {
        margin-top: 0;
    }
    /* List styles */
    ul, 
    ol {
        padding: 0 1rem;
        margin: 1.25rem 1rem 1.25rem 0.4rem;
        
        li p {
        margin-top: 0.25em;
        margin-bottom: 0.25em;
        }
    }
    /* Heading styles */
    h1, 
    h2, 
    h3, 
    h4, 
    h5, 
    h6 {
        line-height: 1.1;
        margin-top: 2.5rem;
        text-wrap: pretty;
    }
    h1, 
    h2 {
        margin-top: 3.5rem;
        margin-bottom: 1.5rem;
    }
    h1 { 
        font-size: 1.4rem; 
    }
    h2 { 
        font-size: 1.2rem; 
    }
    h3 { 
        font-size: 1.1rem; 
    }
    h4, 
    h5, 
    h6 { 
        font-size: 1rem; 
    }
    /* Code and preformatted text styles */
    code {
        background-color: var(--purple-light);
        border-radius: 0.4rem;
        color: var(--black);
        font-size: 0.85rem;
        padding: 0.25em 0.3em;
    }
    pre {
        background: var(--black);
        border-radius: 0.5rem;
        color: var(--white);
        font-family: 'JetBrainsMono', monospace;
        margin: 1.5rem 0;
        padding: 0.75rem 1rem;
        code {
        background: none;
        color: inherit;
        font-size: 0.8rem;
        padding: 0;
        }
    }
    blockquote {
        border-left: 3px solid var(--gray-3);
        margin: 1.5rem 0;
        padding-left: 1rem;
    }
    hr {
        border: none;
        border-top: 1px solid var(--gray-2);
        margin: 2rem 0;
    }

    .control-group {
        display: flex;
        flex-direction: column;
        place-items: start;
        gap: 0.5rem;
    }
</style>