import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core"
import { SubTask, Tasks } from "src/app/types/task"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { TaskService } from "src/app/services/task.service"
import { ConfirmationService, MessageService } from "primeng/api"

@Component({
	selector: "app-task",
	templateUrl: "./task.component.html",
	styleUrls: ["./task.component.css"],
})
export class TaskComponent implements OnInit {
	@Input() task: Tasks | SubTask
	@Input() isSubTask: boolean
	@Input() parentId: number // if task is a sub-task this will be the id of the parent task, otherwise it will be the id of the task itself

	@Output() isDeleted = new EventEmitter<boolean>()

	isEditTaskDialogVisible: boolean = false
	priorityOptions: string[] = ["High", "Medium", "Low"]
	editTaskForm: FormGroup

	constructor(
		private taskService: TaskService,
		private message: MessageService,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
	) {}

	ngOnInit(): void {
		this.editTaskForm = this.fb.group({
			taskName: [this.task.name, Validators.required],
			taskDueDate: [this.task.dueDate],
			taskPriority: [this.task.priority, Validators.required],
		})
	}

	showEditTaskDialog(e: Event) {
		e.preventDefault()
		this.isEditTaskDialogVisible = true
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
					this.editTaskForm.reset()
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
					this.editTaskForm.reset()
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
				message: "Are you sure that you want to delete this subtask?",
				accept: () => {
					this.taskService.deleteSubTask(this.parentId, this.task.id)
					this.editTaskForm.reset()
					this.isEditTaskDialogVisible = false
				},
			})
		} else {
			this.confirmationService.confirm({
				message: "Are you sure that you want to delete this task? THIS WILL DELETE ALL SUBTASKS!",
				accept: () => {
					this.taskService.deleteTask(this.parentId)
					this.editTaskForm.reset()
					this.isEditTaskDialogVisible = false
					setTimeout(() => {
						this.isDeleted.emit(true)
					}, 150)
				},
			})
		}
	}
}
