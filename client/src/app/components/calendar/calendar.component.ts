import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from "@angular/core"
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

	constructor(private taskService: TaskService) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.categoryId && this.isCategory === true) {
			this.taskService
				.getTaskByCategoryId(this.categoryId!)
				.subscribe((tasks) => {
					const eventTaskList = tasks.map((task) => ({
						title: task.name,
						date: task.dueDate.split("T")[0],
					}))
					console.log("test")

					this.calendarOptions.events = eventTaskList
				})
		}
	}
}
