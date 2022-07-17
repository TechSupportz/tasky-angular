import { Component, OnInit } from "@angular/core"
import { TaskService } from "src/app/services/task.service"
import { UserService } from "src/app/services/user.service"
import { Tasks } from "src/app/models/task"
import { User } from "src/app/models/user"
import { BookmarkService } from "src/app/services/bookmark.service"
import { Bookmark } from "src/app/models/bookmark"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MessageService } from "primeng/api"

@Component({
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
	user: User
	taskList: Tasks[]
	bookmarkList: Bookmark[]
	isAddBookmarkDialogVisible: boolean = false
	addBookmarkForm: FormGroup

	constructor(
		private taskService: TaskService,
		private userService: UserService,
		private bookmarkService: BookmarkService,
		private message: MessageService,

		private fb: FormBuilder,
	) {}

	ngOnInit(): void {
		this.addBookmarkForm = this.fb.group({
			bookmarkTitle: ["", Validators.required],
			bookmarkLink: ["", Validators.required],
		})

		this.userService
			.getCurrentUser()
			.subscribe((user) => (this.user = user))

		this.taskService
			.getUpcomingTasks(this.user.id)
			.subscribe((tasks) => (this.taskList = tasks))

		this.bookmarkService
			.getBookmarksByUserId(this.user.id)
			.subscribe((bookmarks) => (this.bookmarkList = bookmarks))
	}

	showAddBookmarkDialog() {
		this.isAddBookmarkDialogVisible = true
	}

	addBookmark() {
		this.bookmarkService
			.addBookmark({
				userId: this.user.id,
				title: this.addBookmarkForm.value.bookmarkTitle,
				link: this.addBookmarkForm.value.bookmarkLink,
			})
			.subscribe((newBookmarkList) => {
				this.bookmarkList = newBookmarkList
				this.isAddBookmarkDialogVisible = false
				this.message.add({
					severity: "success",
					summary: "Bookmark added",
					detail: "Bookmark added successfully",
				})
			})
	}
}
