export interface Create {
	new: { parent: Element, element: Element };
    derived?: boolean;
    checkValidity?: () => boolean;
}

export interface Delete {
	old: { parent: Element; element: Element; reference?: Element | null };
    derived?: boolean;
    checkValidity?: () => boolean;
}
