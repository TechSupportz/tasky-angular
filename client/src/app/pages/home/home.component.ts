import { Component, OnInit } from "@angular/core"
import { TaskService } from "src/app/services/task.service"
import { UserService } from "src/app/services/user.service"
import { Tasks } from "src/app/models/task"
import { User } from "src/app/models/user"
import { BookmarkService } from "src/app/services/bookmark.service"
import { Bookmark } from "src/app/models/bookmark"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ConfirmationService, MessageService } from "primeng/api"

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
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
	) {}

	ngOnInit(): void {
		this.addBookmarkForm = this.fb.group({
			bookmarkTitle: ["", Validators.required],
			bookmarkLink: ["", Validators.required],
		})

		this.userService.getCurrentUser().subscribe((user) => {
			this.user = user
			this.taskService
				.getUpcomingTasks(this.user._id)
				.subscribe((tasks) => (this.taskList = tasks))

			this.bookmarkService
				.getBookmarksByUserId(this.user._id)
				.subscribe((bookmarks) => (this.bookmarkList = bookmarks))
		})
	}

	showAddBookmarkDialog() {
		this.isAddBookmarkDialogVisible = true
	}

	addBookmark() {
		this.bookmarkService
			.addBookmark(
				this.user._id,
				this.addBookmarkForm.value.bookmarkTitle,
				this.addBookmarkForm.value.bookmarkLink,
			)
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

	deleteConfirm(bookmark: Bookmark, e: Event) {
		e.preventDefault
		this.confirmationService.confirm({
			message: "Are you sure you want to delete this bookmark?",
			accept: () => {
				this.bookmarkService
					.deleteBookmark(bookmark._id, bookmark.userId)
					.subscribe((newBookmarkList) => {
						this.bookmarkList = newBookmarkList
						this.message.add({
							severity: "success",
							summary: "Poof!",
							detail: "Bookmark deleted successfully",
						})
					})
			},
		})
	}
}
