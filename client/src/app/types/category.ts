export interface Category {
	id: number;
	name: string;
	type: CategoryType;
	icon?: string;
}

export enum CategoryType {
	INDIV = "INDIV",
	GRP = "GRP",
}