import { Component, Input, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { ConfirmationService, MessageService } from "primeng/api"
import { TaskService } from "src/app/services/task.service"
import { UserService } from "src/app/services/user.service"
import { Tasks } from "src/app/models/task"
import { User } from "src/app/models/user"

@Component({
	selector: "app-task-container",
	templateUrl: "./task-container.component.html",
	styleUrls: ["./task-container.component.css"],
})
export class TaskContainerComponent implements OnInit {
	@Input() isHomePage: boolean = false
	@Input() task: Tasks

	user: User
	isAddSubTaskDialogVisible: boolean = false
	isDeleted: boolean = false
	isCompleted: boolean = false
	addSubTaskForm: FormGroup
	priorityOptions: string[] = ["High", "Medium", "Low"]

	constructor(
		private fb: FormBuilder,
		private userService: UserService,
		private taskService: TaskService,
		private confirmationService: ConfirmationService,
		private message: MessageService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.userService
			.getCurrentUser()
			.subscribe((user) => (this.user = user))

		this.addSubTaskForm = this.fb.group({
			subTaskName: ["", Validators.required],
			subTaskDueDate: ["", Validators.required],
			subTaskPriority: ["", Validators.required],
		})
	}

	goToCategory(): void {
		this.router.navigate([`/category/${this.task.categoryId}`])
	}

	showAddSubTaskDialog(): void {
		this.isAddSubTaskDialogVisible = true
	}

	addSubTask(): void {
		this.taskService
			.addSubTask(
				this.task.id,
				this.user.id,
				this.addSubTaskForm.value.subTaskName,
				this.addSubTaskForm.value.subTaskDueDate,
				this.addSubTaskForm.value.subTaskPriority,
			)
			.subscribe(() => {
				// this.task.subTask.push(subTask)
				this.isAddSubTaskDialogVisible = false
				this.addSubTaskForm.reset()
				this.message.add({
					severity: "success",
					summary: "Task added!",
					detail: "More stuff to do now ;-;",
				})
			})
	}

	deleteTask() {
		this.confirmationService.confirm({
			header: "Delete task",
			message:
				"Are you sure you want to delete this task? This is NOT reversible",
			accept: () => {
				this.taskService.deleteTask(this.task.id)
				this.isDeleted = true
				this.message.add({
					severity: "success",
					summary: "Into the trash it goes!",
					detail: "Task deleted successfully",
				})
			},
		})
	}

	setIsDelete(isDeleted: boolean): void {
		this.isDeleted = isDeleted
	}

	setIsCompleted(isCompleted: boolean): void {
		this.isCompleted = isCompleted
	}

	undoTaskCompletion(): void {
		this.confirmationService.confirm({
			header: "Undo task completion",
			message:
				"Are you sure you want to undo task completion and restore the task?",
			accept: () => {
				this.taskService.setCompleteTaskState(this.task.id, false)
				this.isCompleted = false
				this.message.add({
					severity: "success",
					summary: "ITS ALIVE!",
					detail: "Task restored successfully",
				})
			},
		})
	}
}
