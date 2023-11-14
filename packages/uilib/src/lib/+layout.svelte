<script lang="ts">
  import "$lib/style.css"
  import { page } from "$app/stores"

  const modules = import.meta.glob("./(components|plugins)/**/+page.svelte")
  $: paths = Object.keys(modules)
  	.map((path) => path.replace("/+page.svelte", "").replace("./", "/"))
  	.map((path) => ({
  		link:     path,
  		label:    path,
  		isActive: $page.route.id === path,
  	}))
  	.map((path) => ({
  		...path,
  		label: path.label.replace("/components/", "").replace("/plugins/", ""),
  	}))
  	.map((path) => {
  		return { ...path, label: beautifyHyphenCase(path.label) }
  	})

  function beautifyHyphenCase(hyphenCaseLabel: string): string {
  	return hyphenCaseLabel
  		.replace(/\//g, " ► ")
  		.split(/-|\//)
  		.map((str) => capitalizeFirstLetter(str))
  		.join(" ")
  }

  function capitalizeFirstLetter(str: string) {
  	return str.charAt(0).toUpperCase() + str.slice(1)
  }
</script>

<svelte:head>
  <title>OpenSCD Plugin Library (OPL)</title>
</svelte:head>

<main>
  <sidebar>
    <nav>
      <ul>
        {#each paths as path}
          <li class:current={path.isActive}>
            <a href={path.link}>
              {path.label}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
  </sidebar>
  <content>
    <slot />
  </content>
</main>

<style>
  main {
    display: grid;
    grid-template-columns: 200px 1fr;
    padding: 0;
    margin: 0;
  }

  sidebar {
    height: 100vh;
    border-right: thin gray solid;
    text-align: center;
    padding: 0.5rem 0;
  }

  sidebar ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  sidebar li {
    padding: 6px 8px;
    margin-bottom: 0.25rem;
    border-radius: 6px;
    text-align: left;
  }
  sidebar li:not(.current) {
    margin-left: 2ch;
  }
  sidebar li.current::before {
    content: "> ";
    color: var(--color-blue);
  }
  a {
    text-decoration: none;
  }

  a:hover {
    color: var(--color-blue-1);
  }
  content {
    padding: 2rem 1rem;
  }

  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>
