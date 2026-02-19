import type { Edit, EditV2, Remove, SetAttributes } from '@openscd/oscd-api'

export function isRemoveEdit(edit: EditV2): edit is Remove {
	return 'node' in edit
}

export function isSetAttributesEdit(edit: EditV2): edit is SetAttributes {
	return 'element' in edit && 'attributes' in edit
}
