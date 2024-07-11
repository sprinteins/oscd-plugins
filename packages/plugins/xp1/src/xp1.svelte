<svelte:options tag={null} />


{#if doc}
<h1>XP 1</h1>
<span>Nr Of Plus:{nrOfPlus}</span>
<ul>
	<!-- {#each voltageLevels as vl (vl._id)} -->
	{#each voltageLevels as vl}
		<!-- {#key vl._id} -->
			<li>{crypto.randomUUID()} {vl.name} - {vl.desc}</li>
		<!-- {/key} -->
	{/each}
</ul>

<button on:click={addCountToName}>add + to name</button>
  
{/if}

<input type="hidden" name="package-name" value={pckg.name} />
<input type="hidden" name="package-version" value={pckg.version} />



<script lang="ts">
import * as pckg from "../package.json";

// Inputs
export let doc: XMLDocument;

// Internal

var voltageLevels:any[] = [] 
var nrOfPlus = 0;


$: init(doc)

function init(doc: XMLDocument){
	if(!doc){ return }

	console.log("got doc",doc)
	findVoltageLevels(doc)
}

function findVoltageLevels(doc){
	console.log("looking for VorltageLevels")
	
	voltageLevels = []
	doc.querySelectorAll("VoltageLevel").forEach((vl) => {
		const newVl = new VoltageLevel(vl)
		voltageLevels.push(newVl)
		voltageLevels.forEach( (vl, vi) => {
			vl.observe(() => {
				voltageLevels[vi] = vl
			})
		})
	})
}


function addCountToName(){
	voltageLevels.forEach(vl => {
		vl.el.setAttribute("name", vl.name + " +")
		return vl
	})
	nrOfPlus++
}


class Observable {
	// public el:any;
	// public _id: any;
	// public observers: any[];

	constructor(el){
		this.observers = []
		this.el = el
		this._id = crypto.randomUUID()

		this.setupMutationObserver()
	}

	setupMutationObserver(){
		const config = { attributes: true, childList: false, subtree: false };
		const callback = (mutationList, observer) => {
			for (const mutation of mutationList) {
				if (mutation.type === "attributes") {
					this.notify()
					break
				}
			}
		}
		const observer = new MutationObserver(callback);
		observer.observe(this.el, config);
	}

	subscribe(observer){
		this.observers.push(observer)
	}

	notify(){
		this.observers.forEach(observer => {
			observer()
		})
	}

}

class VoltageLevel extends Observable{
	get name(){
		return this.el.getAttribute("name")
	}

	set name(newName){
		this.el.setAttribute("name", newName)
	}

	get desc(){
		return this.el.getAttribute("desc")
	}

	set desc(newDesc){
		this.el.setAttribute("desc", newDesc)
	}


}

</script>