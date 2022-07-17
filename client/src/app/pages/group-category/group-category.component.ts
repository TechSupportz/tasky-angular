import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { Category } from "src/app/types/category"
import { Tasks } from "src/app/types/task"
import { Subscription } from "rxjs"
import { CategoryService } from "src/app/services/category.service"
import { TaskService } from "src/app/services/task.service"
import { ConfirmationService, MessageService } from "primeng/api"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { UserService } from "src/app/services/user.service"
import { User } from "src/app/types/user"

@Component({
	selector: "app-group-category",
	templateUrl: "./group-category.component.html",
	styleUrls: ["./group-category.component.css"],
})
export class GroupCategoryComponent implements OnInit {
	categoryId: number
	category?: Category
	user: User
	taskList: Tasks[]
	addTaskForm: FormGroup
	isAddTaskDialogVisible: boolean = false
	priorityOptions: string[] = ["High", "Medium", "Low"]
	private routeSubscription: Subscription

	constructor(
		private route: ActivatedRoute,
		private userService: UserService,
		private categoryService: CategoryService,
		private taskService: TaskService,
		private confirmationService: ConfirmationService,
		private message: MessageService,
		private fb: FormBuilder,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.routeSubscription = this.route.params.subscribe((params) => {
			console.log(params)
			this.categoryId = params["id"]

			this.categoryService
				.getCategoryById(this.categoryId)
				.subscribe((category) => (this.category = category))

			this.userService.getCurrentUser().subscribe((user) => {
				this.user = user
				if (
					!this.category?.members?.some(
						(member) => member.userId === user.id,
					)
				) {
					this.router.navigate(["/404"])
				}
			})

			this.taskService
				.getTaskByCategoryId(this.categoryId)
				.subscribe((tasks) => {
					this.taskList = tasks
					console.log(tasks)
				})

			this.addTaskForm = this.fb.group({
				taskName: ["", Validators.required],
				taskDueDate: ["", Validators.required],
				taskPriority: ["", Validators.required],
			})
		})
	}

	showAddTaskDialog() {
		this.isAddTaskDialogVisible = true
	}

	addTask() {
		this.taskService
			.addTask(
				this.categoryId,
				this.user.id,
				this.addTaskForm.value.taskName,
				this.addTaskForm.value.taskDueDate,
				this.addTaskForm.value.taskPriority,
			)
			.subscribe((task) => {
				console.log(task.dueDate)
				this.taskList.push(task)
				this.isAddTaskDialogVisible = false
				this.addTaskForm.reset()
				this.message.add({
					severity: "success",
					summary: "Task added!",
					detail: "More stuff to do now ;-;",
				})
			})
	}

	// 720B, 89

	ngOnDestroy() {
		this.routeSubscription.unsubscribe()
	}
}
