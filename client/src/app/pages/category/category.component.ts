import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { Subscription } from "rxjs"
import { CategoryService } from "src/app/services/category.service"
import { Category } from "src/app/models/category"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ConfirmationService, MessageService } from "primeng/api"
import { TaskService } from "src/app/services/task.service"
import { Tasks } from "src/app/models/task"
import { UserService } from "src/app/services/user.service"
import { User } from "src/app/models/user"
import { NavbarComponent } from "src/app/components/navbar/navbar.component"

@Component({
	selector: "app-category",
	templateUrl: "./category.component.html",
	styleUrls: ["./category.component.css"],
})
export class CategoryComponent implements OnInit {
	categoryId: string
	category?: Category
	user: User
	taskList: Tasks[]
	isSettingsDialogVisible: boolean = false
	isAddTaskDialogVisible: boolean = false
	categorySettingsForm: FormGroup
	addTaskForm: FormGroup
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
		this.addTaskForm = this.fb.group({
			taskName: ["", Validators.required],
			taskDueDate: ["", Validators.required],
			taskPriority: ["", Validators.required],
		})

		this.routeSubscription = this.route.params.subscribe((params) => {
			console.log(params)
			this.categoryId = params["id"]
			this.categoryService
				.getCategoryById(this.categoryId)
				.subscribe((category) => {
					this.category = category
					this.userService.getCurrentUser().subscribe((user) => {
						this.user = user
						if (this.user._id !== this.category?.creatorId) {
							this.router.navigate(["/404"])
						}
					})

					this.taskService
						.getTaskByCategoryId(this.categoryId)
						.subscribe((tasks) => {
							this.taskList = tasks
							console.log(tasks)
						})

					this.categorySettingsForm = this.fb.group({
						categoryName: [
							this.category?.name,
							Validators.required,
						],
					})
				})
		})
	}

	showSettingsDialog() {
		this.isSettingsDialogVisible = true
	}

	showAddTaskDialog() {
		this.isAddTaskDialogVisible = true
	}

	onEdit() {
		this.categoryService
			.updateCategory(
				this.categoryId,
				this.categorySettingsForm.value.categoryName,
			)
			.subscribe((res) => {
				this.category!.name = res.name
				this.isSettingsDialogVisible = false
				this.message.add({
					severity: "success",
					summary: "Updated!",
					detail: "Category has been edited successfully",
				})
			})
	}

	deleteCategory() {
		this.confirmationService.confirm({
			header: "Delete category",
			message:
				"Are you sure you want to delete this category? This is NOT reversible",
			accept: () => {
				this.categoryService.deleteCategory(this.categoryId).subscribe(
					(response) => {
						this.isSettingsDialogVisible = false
						this.router.navigate(["/home"])
						this.message.add({
							severity: "success",
							summary: "YEET!",
							detail: "Category has been deleted",
						})
					},
					(error) => {
						this.message.add({
							severity: "error",
							summary: "Error",
							detail: "Oops Something went wrong",
						})
					},
				)
			},
		})
	}

	addTask() {
		this.taskService
			.addTask(
				this.categoryId,
				this.user._id,
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
}
