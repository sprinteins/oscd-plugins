export interface Delete {
	old: { parent: Element; element: Element; reference?: Element | null };
	derived?: boolean;
	checkValidity?: () => boolean;
}

export interface Replace {
	old: { element: Element };
	new: { element: Element };
	derived?: boolean;
	checkValidity?: () => boolean;
}
