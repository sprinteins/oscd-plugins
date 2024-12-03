<script lang="ts">
import * as pckg from '../package.json'
import { DocumentationPlugin } from '@oscd-plugins/uilib/src/lib/plugins/documentation'

export let doc: XMLDocument
export let editCount: number
</script>

<main>
  <DocumentationPlugin xmlDocument={doc} { editCount }/>

  <input type="hidden" name="package-name" value={pckg.name} />
  <input type="hidden" name="package-version" value={pckg.version} />
</main>

<style>
</style>
