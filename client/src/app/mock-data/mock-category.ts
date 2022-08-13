import { Category, CategoryType } from "../models/category"

export const categoryList: Category[] = [
	{
		_id: "1",
		creatorId: "1",
		name: "FWEB",
		type: CategoryType.INDIV,
	},
	{
		_id: "2",
		creatorId: "1",
		name: "MBAP",
		type: CategoryType.INDIV,
	},
	{
		_id: "3",
		creatorId: "2",
		name: "AMDT",
		type: CategoryType.INDIV,
	},
	{
		_id: "4",
		creatorId: "2",
		name: "INNOVA",
		type: CategoryType.GRP,
		members: [
			{
				userId: "2",
				username: "Marc",
			},
			{
				userId: "3",
				username: "Jake",
			},
		],
	},
]
