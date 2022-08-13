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

	getTaskByCategoryId(categoryId: string): Observable<any> {
		return this.http.get(
			`${APIConfig.BASE_URL}/task/category/${categoryId}`,
		)
	}

	setCompleteTaskState(
		taskId: string,
		isCompleted: boolean,
	): Observable<any> {
		return this.http.put(`${APIConfig.BASE_URL}/task/${taskId}/complete`, {
			isCompleted: isCompleted,
		})
	}

	setCompleteSubTaskState(
		taskId: string,
		subTaskId: string,
		isCompleted: boolean,
	): Observable<any> {
		return this.http.put(
			`${APIConfig.BASE_URL}/task/${taskId}/subTask/${subTaskId}/complete`,
			{
				isCompleted: isCompleted,
			},
		)
	}

	addTask(
		categoryId: string,
		creatorId: string,
		taskName: string,
		taskDueDate: string,
		taskPriority: string,
	): Observable<any> {
		return this.http.post(`${APIConfig.BASE_URL}/task/add`, {
			categoryId: categoryId,
			creatorId: creatorId,
			name: taskName,
			dueDate: this.datePipe.transform(
				taskDueDate,
				"yyyy-MM-ddTHH:mm:ss",
			),
			priority: taskPriority,
		})
	}

	addSubTask(
		taskId: string,
		creatorId: string,
		subTaskName: string,
		subTaskDueDate: string,
		subTaskPriority: string,
	): Observable<any> {
		const task = taskList.find((t) => t._id == taskId)

		return this.http.post(
			`${APIConfig.BASE_URL}/task/${taskId}/subTask/add`,
			{
				creatorId: creatorId,
				name: subTaskName,
				dueDate: this.datePipe.transform(
					subTaskDueDate,
					"yyyy-MM-ddTHH:mm:ss",
				),
				priority: subTaskPriority,
			},
		)
	}

	editTask(
		taskId: string,
		taskName: string,
		taskDueDate: string,
		taskPriority: string,
	): Observable<any> {
		return this.http.put(`${APIConfig.BASE_URL}/task/${taskId}/update`, {
			name: taskName,
			dueDate: this.datePipe.transform(
				taskDueDate,
				"yyyy-MM-ddTHH:mm:ss",
			),
			priority: taskPriority,
		})
	}

	editSubTask(
		taskId: string,
		subTaskId: string,
		subTaskName: string,
		subTaskDueDate: string,
		subTaskPriority: string,
	): Observable<any> {
		return this.http.put(`${APIConfig.BASE_URL}/task/${taskId}/subTask/${subTaskId}/update`, {
			name: subTaskName,
			dueDate: this.datePipe.transform(
				subTaskDueDate,	
				"yyyy-MM-ddTHH:mm:ss",
			),
			priority: subTaskPriority,
		})
	}

	deleteTask(id: string): Observable<any> {
		return this.http.delete(`${APIConfig.BASE_URL}/task/${id}/delete`)
	}

	deleteSubTask(taskId: string, subTaskId: string): Observable<any> {
		return this.http.delete(`${APIConfig.BASE_URL}/task/${taskId}/subTask/${subTaskId}/delete`)
	}
}
