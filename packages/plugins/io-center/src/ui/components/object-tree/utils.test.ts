import { describe, it, expect } from 'vitest';
import type { TreeNode } from './types.object-tree';
import { getOpenItems } from './utils';

const sampleTree: TreeNode[] = [
	{
		name: 'Node 1',
		isOpen: true,
		children: [
			{ name: 'Child 1', isOpen: false },
			{ name: 'Child 2', isOpen: true }
		]
	},
	{
		name: 'Node 2',
		isOpen: false,
		children: [
			{ name: 'Child 3', isOpen: true }
		]
	}
];

describe('getOpenItems', () => {
	it('should return an array of open nodes names', () => {
		const result = getOpenItems(sampleTree);

		const expected = ['Node 1', 'Child 2', 'Child 3'];

		expect(result).toEqual(expected);
	});

	it('should return an empty array if no nodes are open', () => {
		const noOpenNodes: TreeNode[] = [
			{ name: 'Node 1', isOpen: false },
			{ name: 'Node 2', isOpen: false }
		];

		const result = getOpenItems(noOpenNodes);

		expect(result).toEqual([]);
	});

	it('should return an empty array for an empty tree', () => {
		const emptyTree: TreeNode[] = [];

		const result = getOpenItems(emptyTree);

		expect(result).toEqual([]);
	});
});
