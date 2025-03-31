export type FilterOptions = Array<{
    label: string;
    values: {
        selectedType?: Nullable<LpTypes>;
        linked?: boolean;
        unlinked?: boolean;
    };
}> 

export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';
