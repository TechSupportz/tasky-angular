import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs"
import { SubTask, Tasks } from "../types/task"

@Injectable({
	providedIn: "root",
})
export class TaskService {
	private taskList: Tasks[] = [
		{
			id: 1,
			categoryId: 1,
			creatorId: 1,
			name: "FWEB Part 2",
			dueDate: "2022-07-17T23:59:00",
			priority: "High",
			subTask: [
				{
					id: 1,
					name: "something about why react is better",
					dueDate: "2022-07-17T23:59:00",
					priority: "High",
				},
				{
					id: 2,
					name: "idk man something about angular being bad",
					dueDate: "2022-07-17T23:59:00",
					priority: "High",
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
			subTask: [
				{
					id: 1,
					name: "something about why flutter is amazing",
					dueDate: "2022-08-29T23:59:00",
					priority: "High",
				},
				{
					id: 2,
					name: "something about us having to make a widget tree",
					dueDate: "2022-08-29T23:59:00",
					priority: "High",
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
			subTask: [],
		},
	]

	constructor() {}

	getTaskList(): Observable<Tasks[]> {
		const taskList = of(this.taskList)
		return taskList
	}

	getTaskByCategoryId(categoryId: number): Observable<Tasks[]> {
		const taskList = of(
			this.taskList.filter((task) => task.categoryId == categoryId),
		)
		return taskList
	}

	addTask(
		categoryId: number,
		taskName: string,
		taskDueDate: string,
		taskPriority: string,
	): Observable<Tasks> {
		const task: Tasks = {
			id: this.taskList.length + 1,
			categoryId: categoryId,
			creatorId: 1,
			name: taskName,
			dueDate: taskDueDate,
			priority: taskPriority,
			subTask: [],
		}

		this.taskList.push(task)

		return of(task)
	}

	addSubTask(
		taskId: number,
		subTaskName: string,
		subTaskDueDate: string,
		subTaskPriority: string,
	): Observable<SubTask> {
		const task = this.taskList.find((t) => t.id == taskId)
		const subTask: SubTask = {
			id: task!.subTask.length + 1,
			name: subTaskName,
			dueDate: subTaskDueDate,
			priority: subTaskPriority,
		}
		task!.subTask.push(subTask)

		return of(subTask)
	}

	editTask(
		taskId: number,
		taskName: string,
		taskDueDate: string,
		taskPriority: string,
	): Observable<Tasks> {
		const task = this.taskList.find((t) => t.id == taskId)
		task!.name = taskName
		task!.dueDate = taskDueDate
		task!.priority = taskPriority

		return of(this.taskList.find((t) => t.id == taskId)!)
	}

	editSubTask(
		taskId: number,
		subTaskId: number,
		subTaskName: string,
		subTaskDueDate: string,
		subTaskPriority: string,
	): Observable<SubTask> {
		const task = this.taskList.find((t) => t.id == taskId)
		const subTask = task!.subTask.find((t) => t.id == subTaskId)
		subTask!.name = subTaskName
		subTask!.dueDate = subTaskDueDate
		subTask!.priority = subTaskPriority

		return of(task!.subTask.find((t) => t.id == subTaskId)!)
	}

	deleteTask(id: number): void {
		const index = this.taskList.findIndex((t) => t.id == id)
		this.taskList.splice(index, 1)
	}

	deleteSubTask(taskId: number, subTaskId: number): void {
		const task = this.taskList.find((t) => t.id == taskId)
		const index = task!.subTask.findIndex((t) => t.id == subTaskId)
		task!.subTask.splice(index, 1)
	}
}
