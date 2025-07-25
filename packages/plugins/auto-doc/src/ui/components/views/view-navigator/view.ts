export enum View {
	Home = 'Home',
	Create = 'Create',
	Edit = 'Edit'
}
export interface NavigateProps{
	navigate: (viewState: Partial<ViewState>) => void
}

export interface ViewState {
	view: View;
	templateId: string | null;
}
