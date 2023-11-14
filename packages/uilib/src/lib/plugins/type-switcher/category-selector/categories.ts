import { SCDQueries } from "@oscd-plugins/core"

export const ElementCategories = {
	["LN Type"]:   SCDQueries.SelectorLNodeType,
	["DO Type"]:   SCDQueries.SelectorDOType,
	["DA Type"]:   SCDQueries.SelectorDAType,
	["Enum Type"]: SCDQueries.SelectorEnumType,
}

export type ElementCategory = keyof typeof ElementCategories

