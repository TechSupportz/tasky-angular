import {
	Component,
	Input,
	OnInit,
	Output,
	EventEmitter,
	ChangeDetectorRef,
	SimpleChanges,
} from "@angular/core"
import { SubTask, Tasks } from "src/app/models/task"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { TaskService } from "src/app/services/task.service"
import { ConfirmationService, MessageService } from "primeng/api"
import { UserService } from "src/app/services/user.service"
import { CategoryService } from "src/app/services/category.service"
import { User } from "src/app/models/user"

@Component({
	selector: "app-task",
	templateUrl: "./task.component.html",
	styleUrls: ["./task.component.css"],
})
export class TaskComponent implements OnInit {
	@Input() task: Tasks | SubTask
	@Input() isSubTask: boolean
	@Input() parentId: string // if task is a sub-task this will be the id of the parent task, otherwise it will be the id of the task itself
	@Input() isHomePage: boolean = false

	@Output() isDeleted = new EventEmitter<boolean>()
	@Output() isCompleted = new EventEmitter<boolean>()
	@Output() isEditing = new EventEmitter<boolean>()

	username: string
	isGroupTask: boolean
	isTaskCompleted: boolean
	isEditTaskDialogVisible: boolean = false
	priorityOptions: string[] = ["High", "Medium", "Low"]
	editTaskForm: FormGroup
	isSubTaskDeleted: boolean = false

	constructor(
		private taskService: TaskService,
		private userService: UserService,
		private message: MessageService,
		private confirmationService: ConfirmationService,
		private cd: ChangeDetectorRef,
		private fb: FormBuilder,
	) {}

	ngOnInit(): void {
		this.editTaskForm = this.fb.group({
			taskName: [this.task.name, Validators.required],
			taskDueDate: [this.task.dueDate, Validators.required],
			taskPriority: [this.task.priority, Validators.required],
		})

		// console.log(this.task)

		this.isTaskCompleted = this.task.isCompleted

		if (!this.isSubTask) {
			this.isCompleted.emit(this.isTaskCompleted)
		}

		this.userService
			.getUserById(this.task.creatorId)
			.subscribe((user) => (this.username = user.username))
	}

	onDialogVisibleChange(isVisible: boolean) {
		console.log(isVisible)
		this.isEditing.emit(isVisible)
	}

	showEditTaskDialog(e: Event) {
		if (!this.isTaskCompleted) {
			e.preventDefault()
			this.isEditTaskDialogVisible = true
			this.isEditing.emit(true)
		}
	}

	onCompleteStateChange(isCompleted: boolean) {
		if (this.isSubTask) {
			this.taskService
				.setCompleteSubTaskState(
					this.parentId,
					this.task._id,
					isCompleted,
				)
				.subscribe(
					(res) => {
						console.log(
							`sub-task ${
								isCompleted ? "completed" : "un-completed"
							}`,
						)
					},
					(err) => {
						this.message.add({
							severity: "error",
							summary: "Error",
							detail: "Error completing sub-task",
						})
					},
				)
		} else {
			this.cd.detectChanges() // prevents error NG0100 (https://angular.io/errors/NG0100)
			this.taskService
				.setCompleteTaskState(this.parentId, isCompleted)
				.subscribe(
					(res) => {
						this.cd.detectChanges() // prevents error NG0100 (https://angular.io/errors/NG0100)
						this.isCompleted.emit(this.isTaskCompleted)
					},
					(err) => {
						console.log(err)
						this.message.add({
							severity: "error",
							summary: "Error",
							detail: "Error completing task",
						})
					},
				)
		}
	}

	editTask() {
		if (this.isSubTask) {
			this.taskService
				.editSubTask(
					this.parentId,
					this.task._id,
					this.editTaskForm.value.taskName,
					this.editTaskForm.value.taskDueDate,
					this.editTaskForm.value.taskPriority,
				)
				.subscribe(
					(res) => {
						this.task.name = res.name
						this.task.dueDate = res.dueDate
						this.task.priority = res.priority
						this.isEditTaskDialogVisible = false
						this.isEditing.emit(false)
						this.message.add({
							severity: "success",
							summary: "Success",
							detail: "Sub-Task edited successfully",
						})
					},
					(err) => {
						this.message.add({
							severity: "error",
							summary: "Error",
							detail: "Error editing sub-task",
						})
					},
				)
		} else {
			this.taskService
				.editTask(
					this.parentId,
					this.editTaskForm.value.taskName,
					this.editTaskForm.value.taskDueDate,
					this.editTaskForm.value.taskPriority,
				)
				.subscribe(
					(res) => {
						this.task.name = res.name
						this.task.dueDate = res.dueDate
						this.task.priority = res.priority
						this.isEditTaskDialogVisible = false
						this.isEditing.emit(false)

						this.message.add({
							severity: "success",
							summary: "Success",
							detail: "Task edited successfully",
						})
					},
					(err) => {
						this.message.add({
							severity: "error",
							summary: "Error",
							detail: "Error editing task",
						})
					},
				)
		}
	}

	deleteTask() {
		if (this.isSubTask) {
			this.confirmationService.confirm({
				header: "Delete Subtask",
				message:
					"Are you sure that you want to delete this subtask? This is NOT reversible",
				accept: () => {
					console.log(this.task._id)
					this.taskService
						.deleteSubTask(this.parentId, this.task._id)
						.subscribe(
							(res) => {
								this.editTaskForm.reset()
								this.isEditTaskDialogVisible = false
								this.isEditing.emit(false)

								this.isSubTaskDeleted = true
								this.message.add({
									severity: "success",
									summary:
										"Out of sight, out of mind... right?",
									detail: "Subtask deleted successfully",
								})
							},
							(err) => {
								this.message.add({
									severity: "error",
									summary: "Error",
									detail: "Error deleting subtask",
								})
							},
						)
				},
			})
		} else {
			this.confirmationService.confirm({
				header: "Delete Task",
				message:
					"Are you sure that you want to delete this task? THIS WILL DELETE ALL SUBTASKS!",
				accept: () => {
					this.taskService.deleteTask(this.parentId).subscribe(
						(res) => {
							this.editTaskForm.reset()
							this.isEditTaskDialogVisible = false
							this.isEditing.emit(false)
							setTimeout(() => {
								this.isDeleted.emit(true)
							}, 150)
							this.message.add({
								severity: "success",
								summary: "Out of sight, out of mind... right?",
								detail: "Task deleted successfully",
							})
						},
						(err) => {
							this.message.add({
								severity: "error",
								summary: "Error",
								detail: "Error deleting task",
							})
						},
					)
				},
			})
		}
	}
}
