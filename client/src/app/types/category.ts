export interface Category {
	id: number;
	categoryName: string;
	categoryType: CategoryType;
	categoryIcon?: string;
}

export enum CategoryType {
	INDIV = "INDIV",
	GRP = "GRP",
}