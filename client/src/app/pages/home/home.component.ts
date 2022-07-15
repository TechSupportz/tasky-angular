import { Component, OnInit } from "@angular/core"
import { DateTime } from "luxon"
import { TaskService } from "src/app/services/task.service"
import { Tasks } from "src/app/types/task"

@Component({
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
	username: string = "JohnDoe"
	taskList: Tasks[]

	constructor(private taskService: TaskService) {}

	ngOnInit(): void {
		this.taskService
			.getUpcomingTasks()
			.subscribe((tasks) => (this.taskList = tasks))
	}
}
