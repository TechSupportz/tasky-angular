import { Injectable } from "@angular/core"
import { Observable, of, Subject } from "rxjs"
import { SubTask, Tasks } from "../models/task"
import { taskList } from "../mock-data/mock-task"
import { DatePipe } from "@angular/common"
import { DateTime } from "luxon"
import { HttpClient } from "@angular/common/http"
import { APIConfig } from "./apiConfig"

@Injectable({
	providedIn: "root",
})
export class TaskService {
	constructor(private datePipe: DatePipe, private http: HttpClient) {}

	getTaskList(userId: string): Observable<any> {
		return this.http.get(`${APIConfig.BASE_URL}/task/user/${userId}`)
	}

	getUpcomingTasks(userId: string): Observable<Tasks[]> {
		const currentDate = DateTime.now()
		let subject = new Subject<Tasks[]>()

		this.http.get(`${APIConfig.BASE_URL}/task/user/${userId}`).subscribe(
			(res) => {
				const tasks: Tasks[] = res as Tasks[]
				console.log(res)
				tasks.forEach((task) => {
					task.subTask = task.subTask.filter((subTask) => {
						const subTaskDate = DateTime.fromISO(subTask.dueDate)
						const diff = subTaskDate.diff(currentDate, "days")
						return diff.days <= 14
					})
				})

				const upcomingTaskList = tasks.filter((task) => {
					const taskDate = DateTime.fromISO(task.dueDate)
					const diff = taskDate.diff(currentDate, "days")
					if (diff.days <= 14) {
						return task
					} else if (diff.days > 14 && task.subTask.length > 0) {
						return task
					} else {
						return null
					}
				})

				subject.next(upcomingTaskList)
			},
			(err) => {
				console.log(err)
				subject.next([])
			},
		)

		return subject.asObservable()
	}

	getTaskByCategoryId(categoryId: string): Observable<Tasks[]> {
		const filteredTaskList = of(
			taskList.filter((task) => task.categoryId == categoryId),
		)
		return filteredTaskList
	}

	setCompleteTaskState(taskId: string, isCompleted: boolean): void {
		const task = taskList.find((t) => t._id == taskId)
		task!.isCompleted = isCompleted
	}

	setCompleteSubTaskState(
		taskId: string,
		subTaskId: string,
		isCompleted: boolean,
	): void {
		const task = taskList.find((t) => t._id == taskId)
		const subTask = task!.subTask.find((t) => t._id == subTaskId)
		subTask!.isCompleted = isCompleted
	}

	addTask(
		categoryId: string,
		creatorId: string,
		taskName: string,
		taskDueDate: string,
		taskPriority: string,
	): Observable<Tasks> {
		const task: Tasks = {
			_id: "task" + (taskList.length + 1),
			categoryId: categoryId,
			creatorId: creatorId,
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
		taskId: string,
		creatorId: string,
		subTaskName: string,
		subTaskDueDate: string,
		subTaskPriority: string,
	): Observable<SubTask> {
		const task = taskList.find((t) => t._id == taskId)
		const subTask: SubTask = {
			_id: "subTask" + (task!.subTask.length + 1),
			creatorId: creatorId,
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
		taskId: string,
		taskName: string,
		taskDueDate: string,
		taskPriority: string,
	): Observable<Tasks> {
		const task = taskList.find((t) => t._id == taskId)
		task!.name = taskName
		task!.dueDate = this.datePipe.transform(
			taskDueDate,
			"yyyy-MM-ddTHH:mm:ss",
		)!
		task!.priority = taskPriority

		return of(taskList.find((t) => t._id == taskId)!)
	}

	editSubTask(
		taskId: string,
		subTaskId: string,
		subTaskName: string,
		subTaskDueDate: string,
		subTaskPriority: string,
	): Observable<SubTask> {
		const task = taskList.find((t) => t._id == taskId)
		const subTask = task!.subTask.find((t) => t._id == subTaskId)
		subTask!.name = subTaskName
		subTask!.dueDate = this.datePipe.transform(
			subTaskDueDate,
			"yyyy-MM-ddTHH:mm:ss",
		)!
		subTask!.priority = subTaskPriority

		return of(task!.subTask.find((t) => t._id == subTaskId)!)
	}

	deleteTask(id: string): void {
		const index = taskList.findIndex((t) => t._id == id)
		taskList.splice(index, 1)
	}

	deleteTaskByCategoryId(categoryId: string): void {
		taskList.forEach((task) => {
			if (task.categoryId == categoryId) {
				const index = taskList.findIndex((t) => t._id == task._id)
				taskList.splice(index, 1)
			}
		})
	}

	deleteSubTask(taskId: string, subTaskId: string): void {
		const task = taskList.find((t) => t._id == taskId)
		const index = task!.subTask.findIndex((t) => t._id == subTaskId)
		task!.subTask.splice(index, 1)
	}
}
