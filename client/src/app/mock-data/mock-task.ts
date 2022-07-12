import { Tasks } from "../types/task"

export const taskList: Tasks[] = [
	{
		id: 1,
		categoryId: 1,
		creatorId: 1,
		name: "FWEB Part 2",
		dueDate: "2022-07-17T23:59:00",
		priority: "High",
		isCompleted: false,
		subTask: [
			{
				id: 1,
				name: "something about why react is better",
				dueDate: "2022-07-17T23:59:00",
				priority: "High",
				isCompleted: true,
			},
			{
				id: 2,
				name: "idk man something about angular being bad",
				dueDate: "2022-07-17T23:59:00",
				priority: "High",
				isCompleted: false,
			},
		],
	},
	{
		id: 2,
		categoryId: 2,
		creatorId: 1,
		name: "MBAP Part 2",
		dueDate: "2022-06-29T23:59:00",
		priority: "High",
		isCompleted: false,
		subTask: [
			{
				id: 1,
				name: "something about why flutter is amazing",
				dueDate: "2022-08-29T23:59:00",
				priority: "High",
				isCompleted: false,
			},
			{
				id: 2,
				name: "something about us having to make a widget tree",
				dueDate: "2022-08-29T23:59:00",
				priority: "High",
				isCompleted: false,
			},
		],
	},
	{
		id: 3,
		categoryId: 2,
		creatorId: 1,
		name: "MBAP Part 3",
		dueDate: "2022-06-29T23:59:00",
		priority: "High",
		isCompleted: false,
		subTask: [],
	},
]