export type Replace = {
		old: { element: Element };
		new: { element: Element };
		derived?: boolean;
		checkValidity?: () => boolean;
	}