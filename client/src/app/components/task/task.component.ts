import {
	Component,
	Input,
	OnInit,
	Output,
	EventEmitter,
	ChangeDetectorRef,
} from "@angular/core"
import { SubTask, Tasks } from "src/app/types/task"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { TaskService } from "src/app/services/task.service"
import { ConfirmationService, MessageService } from "primeng/api"
import { UserService } from "src/app/services/user.service"
import { CategoryService } from "src/app/services/category.service"
import { User } from "src/app/types/user"

@Component({
	selector: "app-task",
	templateUrl: "./task.component.html",
	styleUrls: ["./task.component.css"],
})
export class TaskComponent implements OnInit {
	@Input() task: Tasks | SubTask
	@Input() isSubTask: boolean
	@Input() parentId: number // if task is a sub-task this will be the id of the parent task, otherwise it will be the id of the task itself
	@Input() isHomePage: boolean = false

	@Output() isDeleted = new EventEmitter<boolean>()
	@Output() isCompleted = new EventEmitter<boolean>()

	username: string
	isGroupTask: boolean
	isTaskCompleted: boolean
	isEditTaskDialogVisible: boolean = false
	priorityOptions: string[] = ["High", "Medium", "Low"]
	editTaskForm: FormGroup

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

		this.isTaskCompleted = this.task.isCompleted

		if (!this.isSubTask) {
			this.isCompleted.emit(this.isTaskCompleted)
		}

		this.userService
			.getUserById(this.task.creatorId)
			.subscribe((user) => (this.username = user.username))
	}

	showEditTaskDialog(e: Event) {
		if (!this.isTaskCompleted) {
			e.preventDefault()
			this.isEditTaskDialogVisible = true
		}
	}

	onCompleteStateChange(isCompleted: boolean) {
		if (this.isSubTask) {
			this.taskService.setCompleteSubTaskState(
				this.parentId,
				this.task.id,
				isCompleted,
			)
		} else {
			this.taskService.setCompleteTaskState(this.parentId, isCompleted)
			this.cd.detectChanges() // prevents error NG0100 (https://angular.io/errors/NG0100)
			this.isCompleted.emit(this.isTaskCompleted)
		}
	}

	editTask() {
		if (this.isSubTask) {
			this.taskService
				.editSubTask(
					this.parentId,
					this.task.id,
					this.editTaskForm.value.taskName,
					this.editTaskForm.value.taskDueDate,
					this.editTaskForm.value.taskPriority,
				)
				.subscribe(() => {
					this.isEditTaskDialogVisible = false
					this.message.add({
						severity: "success",
						summary: "Success",
						detail: "Task edited successfully",
					})
				})
		} else {
			this.taskService
				.editTask(
					this.parentId,
					this.editTaskForm.value.taskName,
					this.editTaskForm.value.taskDueDate,
					this.editTaskForm.value.taskPriority,
				)
				.subscribe(() => {
					this.isEditTaskDialogVisible = false
					this.message.add({
						severity: "success",
						summary: "Success",
						detail: "Task edited successfully",
					})
				})
		}
	}

	deleteTask() {
		if (this.isSubTask) {
			console.log("what?")
			this.confirmationService.confirm({
				header: "Delete Subtask",
				message:
					"Are you sure that you want to delete this subtask? This is NOT reversible",
				accept: () => {
					this.taskService.deleteSubTask(this.parentId, this.task.id)
					this.editTaskForm.reset()
					this.isEditTaskDialogVisible = false
					this.message.add({
						severity: "success",
						summary: "Out of sight, out of mind... right?",
						detail: "Subtask deleted successfully",
					})
				},
			})
		} else {
			this.confirmationService.confirm({
				header: "Delete Task",
				message:
					"Are you sure that you want to delete this task? THIS WILL DELETE ALL SUBTASKS!",
				accept: () => {
					this.taskService.deleteTask(this.parentId)
					this.editTaskForm.reset()
					this.isEditTaskDialogVisible = false
					setTimeout(() => {
						this.isDeleted.emit(true)
					}, 150)
					this.message.add({
						severity: "success",
						summary: "Out of sight, out of mind... right?",
						detail: "Task deleted successfully",
					})
				},
			})
		}
	}
}
