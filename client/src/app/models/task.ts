export interface Tasks {
	_id: string
	categoryId: string
	creatorId: string
	name: string
	dueDate: string
	priority: string
	isCompleted: boolean
	subTask: SubTask[]
}

export interface SubTask {
	_id: string
	creatorId: string
	name: string
	dueDate: string
	priority: string
	isCompleted: boolean
}
