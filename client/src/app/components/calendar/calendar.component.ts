import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from "@angular/core"
import { Router } from "@angular/router"
import { CalendarOptions, EventSourceInput } from "@fullcalendar/angular"
import { TaskService } from "src/app/services/task.service"
import { UserService } from "src/app/services/user.service"
import { Tasks } from "src/app/models/task"
import { User } from "src/app/models/user"
import { MessageService } from "primeng/api"

@Component({
	selector: "app-calendar",
	templateUrl: "./calendar.component.html",
	styleUrls: ["./calendar.component.css"],
})
export class CalendarComponent implements OnChanges {
	@Input() isCategory: boolean = false
	@Input() categoryId?: string

	user: User
	calendarOptions: CalendarOptions = {
		initialView: "dayGridMonth",
		events: [],
	}

	constructor(
		private userService: UserService,
		private taskService: TaskService,
		private router: Router,
		private message: MessageService
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		this.userService
			.getCurrentUser()
			.subscribe((user) => (this.user = user))

		if (changes.categoryId) {
			this.taskService
				.getTaskByCategoryId(this.categoryId!)
				.subscribe((tasks) => {
					this.generateEventList(tasks)
				})
		} else {
			this.taskService.getTaskList(this.user._id).subscribe((res: Tasks[]) => {
				this.generateEventList(res)
			}, (err) => {
				console.log(err)
				this.generateEventList([])
				this.message.add({
					severity: "error",
					summary: "Error",
					detail: "Something went wrong",
				})
			})
		}
	}

	generateEventList(tasks: Tasks[]): void {
		const _eventTaskList = tasks.map((task) => ({
			title: task.name,
			date: task.dueDate.split("T")[0],
			url: `/category/${task.categoryId}`,
			color:
				task.priority === "Low"
					? "green"
					: task.priority === "Medium"
					? "orange"
					: "red",
		}))

		const _eventSubTaskList = tasks.flatMap((task) =>
			task.subTask.map((subTask) => ({
				title: subTask.name,
				date: subTask.dueDate.split("T")[0],
				url: `/category/${task.categoryId}`,
				color:
					subTask.priority === "Low"
						? "green"
						: subTask.priority === "Medium"
						? "orange"
						: "red",
			})),
		)
		this.calendarOptions.events = _eventTaskList.concat(_eventSubTaskList)
	}

	eventClick(info: any): void {
		info.jsEvent.preventDefault()
		this.router.navigate(["/category/1"])
	}
}
