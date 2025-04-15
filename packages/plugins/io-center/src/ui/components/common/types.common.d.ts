export type FilterOptions = Array<{
    label: string;
    values: {
        selectedTypes?: Nullable<LpTypes[]>;
        linked?: boolean;
        unlinked?: boolean;
    };
}> 

export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';
