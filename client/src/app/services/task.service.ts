import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs"
import { SubTask, Tasks } from "../types/task"
import { taskList } from "../mock-data/mock-task"

@Injectable({
	providedIn: "root",
})
export class TaskService {
	constructor() {}

	getTaskList(): Observable<Tasks[]> {
		return of(taskList)
	}

	getTaskByCategoryId(categoryId: number): Observable<Tasks[]> {
		const filteredTaskList = of(
			taskList.filter((task) => task.categoryId == categoryId),
		)
		return filteredTaskList
	}
	
	setCompleteTaskState(taskId: number, isCompleted: boolean): void {
		const task = taskList.find((t) => t.id == taskId)
		task!.isCompleted = true
	}

	setCompleteSubTaskState(taskId: number, subTaskId: number, isCompleted: boolean): void {
		const task = taskList.find((t) => t.id == taskId)
		const subTask = task!.subTask.find((t) => t.id == subTaskId)
		subTask!.isCompleted = true
	}

	addTask(
		categoryId: number,
		taskName: string,
		taskDueDate: string,
		taskPriority: string,
	): Observable<Tasks> {
		const task: Tasks = {
			id: taskList.length + 1,
			categoryId: categoryId,
			creatorId: 1,
			name: taskName,
			dueDate: taskDueDate,
			priority: taskPriority,
			isCompleted: false,
			subTask: [],
		}

		taskList.push(task)

		return of(task)
	}

	addSubTask(
		taskId: number,
		subTaskName: string,
		subTaskDueDate: string,
		subTaskPriority: string,
	): Observable<SubTask> {
		const task = taskList.find((t) => t.id == taskId)
		const subTask: SubTask = {
			id: task!.subTask.length + 1,
			name: subTaskName,
			dueDate: subTaskDueDate,
			priority: subTaskPriority,
			isCompleted: false,
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
		const task = taskList.find((t) => t.id == taskId)
		task!.name = taskName
		task!.dueDate = taskDueDate
		task!.priority = taskPriority

		return of(taskList.find((t) => t.id == taskId)!)
	}

	editSubTask(
		taskId: number,
		subTaskId: number,
		subTaskName: string,
		subTaskDueDate: string,
		subTaskPriority: string,
	): Observable<SubTask> {
		const task = taskList.find((t) => t.id == taskId)
		const subTask = task!.subTask.find((t) => t.id == subTaskId)
		subTask!.name = subTaskName
		subTask!.dueDate = subTaskDueDate
		subTask!.priority = subTaskPriority

		return of(task!.subTask.find((t) => t.id == subTaskId)!)
	}

	deleteTask(id: number): void {
		const index = taskList.findIndex((t) => t.id == id)
		taskList.splice(index, 1)
	}

	deleteSubTask(taskId: number, subTaskId: number): void {
		const task = taskList.find((t) => t.id == taskId)
		const index = task!.subTask.findIndex((t) => t.id == subTaskId)
		task!.subTask.splice(index, 1)
	}
}
