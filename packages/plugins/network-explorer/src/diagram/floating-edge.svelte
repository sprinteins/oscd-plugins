<script lang="ts">
import { type EdgeProps, getStraightPath, useSvelteFlow } from '@xyflow/svelte'
import { getEdgeParams } from './x'

interface Props {
	//   type $$Props = EdgeProps;
	source: EdgeProps['source']
	target: EdgeProps['target']
	markerEnd?: EdgeProps['markerEnd']
	style?: EdgeProps['style']
	id: EdgeProps['id']
}

let {
	source,
	target,
	markerEnd = undefined,
	style = undefined,
	id
}: Props = $props()

const { getInternalNode } = useSvelteFlow()

let edgePath: string | undefined = $state()

$effect(() => {
	const sourceNode = getInternalNode(source)
	const targetNode = getInternalNode(target)

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
})
</script>

<path {id} marker-end={markerEnd} d={edgePath} {style} />