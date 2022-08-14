export interface Category {
	_id: string
	icon?: string
	creatorId: string
	name: string
	type: CategoryType
	boardId?: string
	members?: CategoryMember[]
}

export interface CategoryMember {
	userId: string
	username: string
}

export enum CategoryType {
	INDIV = "INDIV",
	GRP = "GRP",
}
