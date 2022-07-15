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
import { Tasks } from "src/app/types/task"

@Component({
	selector: "app-calendar",
	templateUrl: "./calendar.component.html",
	styleUrls: ["./calendar.component.css"],
})
export class CalendarComponent implements OnChanges {
	@Input() isCategory: boolean = false
	@Input() categoryId?: number

	calendarOptions: CalendarOptions = {
		initialView: "dayGridMonth",
		events: [],
	}

	constructor(private taskService: TaskService, private router: Router) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.categoryId) {
			this.taskService
				.getTaskByCategoryId(this.categoryId!)
				.subscribe((tasks) => {
					this.generateEventList(tasks)
				})
		} else {
			this.taskService.getTaskList().subscribe((tasks) => {
				this.generateEventList(tasks)
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
		this.router.navigate([info.event.url])
	}
}
