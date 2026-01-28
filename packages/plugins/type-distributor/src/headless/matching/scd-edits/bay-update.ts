import { v4 as uuidv4 } from 'uuid'
import type { BayType } from "../../types"
import type { SetAttributes } from "@openscd/oscd-api"

export function updateBay(
    scdBay: Element,
    bayType: BayType
): SetAttributes {
	return {
		element: scdBay,
		attributes: {
			uuid: scdBay.getAttribute('uuid') || uuidv4(),
			templateUuid: bayType.uuid
		},
		attributesNS: {}
	}
}