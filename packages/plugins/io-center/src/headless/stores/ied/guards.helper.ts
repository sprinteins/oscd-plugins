// CONSTANTS
import { TREE_LEVEL } from '@/headless/constants'
// TYPES
import type {
	TreeItem,
	DataObject,
	RawLogical,
	LogicalConditionerClass,
	LogicalPhysicalClass
} from '@/headless/stores'

export function isDataObject(
	objectToTest:
		| TreeItem
		| DataObject
		| RawLogical<LogicalConditionerClass | LogicalPhysicalClass>
): objectToTest is DataObject {
	return 'level' in objectToTest && objectToTest.level === TREE_LEVEL.dO
}
