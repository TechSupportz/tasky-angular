export interface Tasks {
	id: number
	categoryId: number
	creatorId: number
	name: string
	dueDate: string
	priority: string
	isCompleted: boolean
	subTask: SubTask[]
}

export interface SubTask {
	id: number
	name: string
	dueDate: string
	priority: string
	isCompleted: boolean
}