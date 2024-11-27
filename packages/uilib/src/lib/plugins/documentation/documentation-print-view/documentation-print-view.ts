import type { IEDCommInfo } from "@oscd-plugins/core"
import { extractIEDInfosWithBay, extractIEDInfosWithBus } from "../../communication-explorer/_func-layout-calculation"


export function calcBayIEDs(root: Element): Map<string, IEDCommInfo[]> {
	if (!root) {
		console.info({ level: "info", msg: "initInfos: no root" })
		return new Map()
	}

	return extractIEDInfosWithBay(root)
}

export function calcBusIEDs(root: Element): Map<string, IEDCommInfo[]> {
	if (!root) {
		console.info({ level: "info", msg: "initInfos: no root" })
		return new Map()
	}

	return extractIEDInfosWithBus(root)
}


