import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs"
import { SubTask, Tasks } from "../types/task"
import { taskList } from "../mock-data/mock-task"
import { DatePipe } from "@angular/common"
import { DateTime } from "luxon"

@Injectable({
	providedIn: "root",
})
export class TaskService {
	constructor(private datePipe: DatePipe) {}

	getTaskList(): Observable<Tasks[]> {
		return of(taskList)
	}

	getUpcomingTasks(): Observable<Tasks[]> {
		const currentDate = DateTime.now()

		const taskListCopy: Tasks[] = JSON.parse(JSON.stringify(taskList))

		const upcomingTaskList = taskListCopy.filter((task) => {
			const taskDate = DateTime.fromISO(task.dueDate)
			const diff = taskDate.diff(currentDate, "days")
			return diff.days <= 14
		})

		upcomingTaskList.forEach((task) => {
			task.subTask = task.subTask.filter((subTask) => {
				const subTaskDate = DateTime.fromISO(subTask.dueDate)
				const diff = subTaskDate.diff(currentDate, "days")
				return diff.days <= 14
			})
		})

		return of(upcomingTaskList)
	}

	getTaskByCategoryId(categoryId: number): Observable<Tasks[]> {
		const filteredTaskList = of(
			taskList.filter((task) => task.categoryId == categoryId),
		)
		return filteredTaskList
	}

	setCompleteTaskState(taskId: number, isCompleted: boolean): void {
		const task = taskList.find((t) => t.id == taskId)
		task!.isCompleted = isCompleted
	}

	setCompleteSubTaskState(
		taskId: number,
		subTaskId: number,
		isCompleted: boolean,
	): void {
		const task = taskList.find((t) => t.id == taskId)
		const subTask = task!.subTask.find((t) => t.id == subTaskId)
		subTask!.isCompleted = isCompleted
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
			dueDate: this.datePipe.transform(
				taskDueDate,
				"yyyy-MM-ddTHH:mm:ss",
			)!,
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
			creatorId: 1,
			name: subTaskName,
			dueDate: this.datePipe.transform(
				subTaskDueDate,
				"yyyy-MM-ddTHH:mm:ss",
			)!,
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
		task!.dueDate = this.datePipe.transform(
			taskDueDate,
			"yyyy-MM-ddTHH:mm:ss",
		)!
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
		subTask!.dueDate = this.datePipe.transform(
			subTaskDueDate,
			"yyyy-MM-ddTHH:mm:ss",
		)!
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
