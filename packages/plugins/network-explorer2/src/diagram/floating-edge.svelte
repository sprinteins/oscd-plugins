<svelte:options immutable />

<script lang="ts">
  import { run } from 'svelte/legacy';

  import { getStraightPath, useNodes, type EdgeProps, type Node } from "@xyflow/svelte"
  import { getEdgeParams } from "./x"



  interface Props {
    //   type $$Props = EdgeProps;
    source: EdgeProps["source"];
    target: EdgeProps["target"];
    markerEnd?: EdgeProps["markerEnd"];
    style?: EdgeProps["style"];
    id: EdgeProps["id"];
  }

  let {
    source,
    target,
    markerEnd = undefined,
    style = undefined,
    id
  }: Props = $props();

  const nodes = useNodes()

  let sourceNode: Node | undefined = $state()
  let targetNode: Node | undefined = $state()

  let edgePath: string | undefined = $state()

  run(() => {
  	$nodes.forEach((node) => {
  		if (node.id === source) sourceNode = node
  		if (node.id === target) targetNode = node
  	})
  	if (sourceNode && targetNode) {
  		const edgeParams = getEdgeParams(sourceNode, targetNode)
  		edgePath = getStraightPath({
  			sourceX: edgeParams.sx,
  			sourceY: edgeParams.sy,
  			targetX: edgeParams.tx,
  			targetY: edgeParams.ty
  		})[0]
  	} else {
  		edgePath = undefined
  	}
  });
</script>

<path {id} marker-end={markerEnd} d={edgePath} {style} />