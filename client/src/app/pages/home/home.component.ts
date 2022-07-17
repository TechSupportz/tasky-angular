import { Component, OnInit } from "@angular/core"
import { TaskService } from "src/app/services/task.service"
import { UserService } from "src/app/services/user.service"
import { Tasks } from "src/app/models/task"
import { User } from "src/app/models/user"
import { BookmarkService } from "src/app/services/bookmark.service"
import { Bookmark } from "src/app/models/bookmark"

@Component({
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
	user: User
	taskList: Tasks[]
	bookmarkList: Bookmark[]

	constructor(
		private taskService: TaskService,
		private userService: UserService,
		private bookmarkService: BookmarkService,
	) {}

	ngOnInit(): void {
		this.userService
			.getCurrentUser()
			.subscribe((user) => (this.user = user))

		this.taskService
			.getUpcomingTasks(this.user.id)
			.subscribe((tasks) => (this.taskList = tasks))

		this.bookmarkService
			.getBookmarks()
			.subscribe((bookmarks) => (this.bookmarkList = bookmarks))
	}
}
