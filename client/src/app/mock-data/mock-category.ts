import { Category, CategoryType } from "../types/category"

export const categoryList: Category[] = [
	{
		id: 1,
		creatorId: 1,
		name: "FWEB",
		type: CategoryType.INDIV,
	},
	{
		id: 2,
		creatorId: 1,
		name: "MBAP",
		type: CategoryType.INDIV,
	},
	{
		id: 3,
		creatorId: 2,
		name: "AMDT",
		type: CategoryType.INDIV,
	},
	{
		id: 4,
		creatorId: 1,
		name: "INNOVA",
		type: CategoryType.GRP,
		members: [
			{
				userId: 1,
			},
			{
				userId: 2,
			},
		],
	},
]
