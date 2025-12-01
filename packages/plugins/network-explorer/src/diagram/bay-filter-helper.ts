import type { Edge, Node as FlowNodes } from "@xyflow/svelte";
import { getIedNameFromId } from "./ied-helper";
import type { BayIEDNameMap } from "./networking";

const IED_ID_PREFIX = "ied-";
const BAY_ID_PREFIX = "bay-";

export function filterNodesAndEdgesForBays(
  targetBayNames: Set<string>,
  nodes: FlowNodes[],
  edges: Edge[],
  iedBayMap: BayIEDNameMap
): { nodes: FlowNodes[]; edges: Edge[] } {
  const aggregatedNodes: FlowNodes[] = [];
  const aggregatedEdges: Edge[] = [];

  for (const targetBayName of targetBayNames) {
    const { nodes: bayNodes, edges: bayEdges } = filterNodesAndEdgesForBay(
      targetBayName,
      nodes,
      edges,
      iedBayMap
    );

    for (const node of bayNodes) {
      if (!aggregatedNodes.some((n) => n.id === node.id)) {
        aggregatedNodes.push(node);
      }
    }

    for (const edge of bayEdges) {
      if (
        !aggregatedEdges.some(
          (e) => e.source === edge.source && e.target === edge.target
        )
      ) {
        aggregatedEdges.push(edge);
      }
    }
  }
  return { nodes: aggregatedNodes, edges: aggregatedEdges };
}

function filterNodesAndEdgesForBay(
  targetBayName: string,
  nodes: FlowNodes[],
  edges: Edge[],
  iedBayMap: BayIEDNameMap
): { nodes: FlowNodes[]; edges: Edge[] } {
  const iedIdsInTargetBay = getIedIdsInTargetBay(targetBayName, iedBayMap);

  if (!doesTargetBayNodeExist(targetBayName, nodes)) {
    console.warn(`Bay ${targetBayName} not found`);
    return { nodes: [], edges: [] };
  }

  const connectedIedIds = findConnectedIedIds(edges, iedIdsInTargetBay);
  const filteredConnectedIedIds = excludeIedsBelongingToOtherBays(
    connectedIedIds,
    targetBayName,
    iedBayMap
  );
  const allowedIedIds = combineAllowedIedIds(
    iedIdsInTargetBay,
    filteredConnectedIedIds
  );

  const filteredNodes = filterNodesForTargetBay(
    nodes,
    targetBayName,
    allowedIedIds
  );
  const filteredEdges = filterEdgesBetweenAllowedIeds(edges, allowedIedIds);

  return { nodes: filteredNodes, edges: filteredEdges };
}

function getIedIdsInTargetBay(
  targetBayName: string,
  iedBayMap: BayIEDNameMap
): Set<string> {
  const iedsInTargetBay = iedBayMap[targetBayName] || [];
  return new Set(iedsInTargetBay.map((name) => `${IED_ID_PREFIX}${name}`));
}

function doesTargetBayNodeExist(
  targetBayName: string,
  nodes: FlowNodes[]
): boolean {
  return nodes.some((n) => n.id === `${BAY_ID_PREFIX}${targetBayName}`);
}

function findConnectedIedIds(
  edges: Edge[],
  iedIdsInTargetBay: Set<string>
): Set<string> {
  const connectedIedIds = new Set<string>();

  for (const edge of edges) {
    const sourceInTargetBay = iedIdsInTargetBay.has(edge.source);
    const targetInTargetBay = iedIdsInTargetBay.has(edge.target);

    if (sourceInTargetBay) {
      connectedIedIds.add(edge.target);
    }
    if (targetInTargetBay) {
      connectedIedIds.add(edge.source);
    }
  }
  return connectedIedIds;
}

function excludeIedsBelongingToOtherBays(
  connectedIedIds: Set<string>,
  targetBayName: string,
  iedBayMap: BayIEDNameMap
): Set<string> {
  const filteredConnectedIedIds = new Set<string>();

  for (const iedId of connectedIedIds) {
    const iedName = getIedNameFromId(iedId);
    const belongsToOtherBay = doesIedBelongToOtherBay(
      iedName,
      targetBayName,
      iedBayMap
    );

    if (!belongsToOtherBay) {
      filteredConnectedIedIds.add(iedId);
    }
  }
  return filteredConnectedIedIds;
}

function doesIedBelongToOtherBay(
  iedName: string,
  targetBayName: string,
  iedBayMap: BayIEDNameMap
): boolean {
  return Object.keys(iedBayMap).some((bayName) => {
    return bayName !== targetBayName && iedBayMap[bayName].includes(iedName);
  });
}

function combineAllowedIedIds(
  iedIdsInTargetBay: Set<string>,
  filteredConnectedIedIds: Set<string>
): Set<string> {
  return new Set([...iedIdsInTargetBay, ...filteredConnectedIedIds]);
}

function filterNodesForTargetBay(
  nodes: FlowNodes[],
  targetBayName: string,
  allowedIedIds: Set<string>
): FlowNodes[] {
  return nodes.filter((node) => {
    if (node.id === `${BAY_ID_PREFIX}${targetBayName}`) {
      return true;
    }
    return allowedIedIds.has(node.id);
  });
}

function filterEdgesBetweenAllowedIeds(
  edges: Edge[],
  allowedIedIds: Set<string>
): Edge[] {
  return edges.filter((edge) => {
    return allowedIedIds.has(edge.source) && allowedIedIds.has(edge.target);
  });
}
