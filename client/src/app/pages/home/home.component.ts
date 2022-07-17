import { Component, OnInit } from "@angular/core"
import { TaskService } from "src/app/services/task.service"
import { UserService } from "src/app/services/user.service"
import { Tasks } from "src/app/models/task"
import { User } from "src/app/models/user"

@Component({
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
	user: User
	taskList: Tasks[]

	constructor(
		private taskService: TaskService,
		private userService: UserService,
	) {}

	ngOnInit(): void {
		this.userService
			.getCurrentUser()
			.subscribe((user) => (this.user = user))

		this.taskService
			.getUpcomingTasks(this.user.id)
			.subscribe((tasks) => (this.taskList = tasks))
	}
}
