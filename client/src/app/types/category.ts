export interface Category {
	id: number
	icon?: string
	creatorId: number
	name: string
	type: CategoryType
	members?: CategoryMember[]
}

export interface CategoryMember{
	userId: number
}

export enum CategoryType {
	INDIV = "INDIV",
	GRP = "GRP",
}
