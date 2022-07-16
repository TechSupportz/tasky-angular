import { Component, OnInit } from "@angular/core"
import { TaskService } from "src/app/services/task.service"
import { UserService } from "src/app/services/user.service"
import { Tasks } from "src/app/types/task"

@Component({
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
	username: string 
	taskList: Tasks[]

	constructor(
		private taskService: TaskService,
		private userService: UserService,
	) {}

	ngOnInit(): void {
		this.taskService
			.getUpcomingTasks()
			.subscribe((tasks) => (this.taskList = tasks))

		this.userService
			.getCurrentUser()
			.subscribe((user) => (this.username = user.username))
	}
}
