import { Component, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { Category } from "src/app/types/category"
import { Tasks } from "src/app/types/task"
import { Subscription } from "rxjs"
import { CategoryService } from "src/app/services/category.service"
import { TaskService } from "src/app/services/task.service"
import { ConfirmationService, MessageService } from "primeng/api"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"

@Component({
	selector: "app-group-category",
	templateUrl: "./group-category.component.html",
	styleUrls: ["./group-category.component.css"],
})
export class GroupCategoryComponent implements OnInit {
	categoryId: number
	category?: Category
	taskList: Tasks[]
	addTaskForm: FormGroup
	isAddTaskDialogVisible: boolean = false
	priorityOptions: string[] = ["High", "Medium", "Low"]
	private routeSubscription: Subscription

	constructor(
		private route: ActivatedRoute,
		private categoryService: CategoryService,
		private taskService: TaskService,
		private confirmationService: ConfirmationService,
		private message: MessageService,
		private fb: FormBuilder,
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
