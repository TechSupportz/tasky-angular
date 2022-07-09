import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { Subscription } from "rxjs"
import { CategoryService } from "src/app/services/category.service"
import { Category } from "src/app/types/category"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ConfirmationService, MessageService } from "primeng/api"
import { TaskService } from "src/app/services/task.service"
import { Tasks } from "src/app/types/task"

@Component({
	selector: "app-category",
	templateUrl: "./category.component.html",
	styleUrls: ["./category.component.css"],
})
export class CategoryComponent implements OnInit {
	categoryId: number
	category?: Category
	taskList: Tasks[]
	isSettingsDialogVisible: boolean = false
	isAddTaskDialogVisible: boolean = false
	categorySettingsForm: FormGroup
	addTaskForm: FormGroup
	priorityOptions: string[] = ["High", "Medium", "Low"]
	private routeSubscription!: Subscription

	constructor(
		private route: ActivatedRoute,
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

			this.taskService
				.getTaskByCategoryId(this.categoryId)
				.subscribe((tasks) => {
					this.taskList = tasks
				})

			this.categorySettingsForm = this.fb.group({
				categoryName: [
					this.category?.categoryName,
					Validators.required,
				],
			})

			this.addTaskForm = this.fb.group({
				taskName: ["", Validators.required],
				taskDueDate: [""],
				taskPriority: [""],
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
			.editCategory({
				id: this.categoryId,
				categoryName: this.categorySettingsForm.value.categoryName,
			})
			.subscribe((category) => {
				this.categoryId = category.id
				this.category = category
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
			message:
				"Are you sure you want to delete this category? This is NOT reversible",
			accept: () => {
				this.categoryService.deleteCategory(this.categoryId)
				this.isSettingsDialogVisible = false
				this.router.navigate(["/home"])
				this.message.add({
					severity: "success",
					summary: "Poof!",
					detail: "Category deleted successfully",
				})
			},
		})
	}

	addTask() {
		this.taskService
			.addTask(
				this.categoryId,
				this.addTaskForm.value.taskName,
				this.addTaskForm.value.taskDueDate,
				this.addTaskForm.value.taskPriority,
			)
			.subscribe((task) => {
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

	ngOnDestroy() {
		this.routeSubscription.unsubscribe()
	}
}
