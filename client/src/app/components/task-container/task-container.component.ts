import { Component, Input, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MessageService } from "primeng/api"
import { TaskService } from "src/app/services/task.service"
import { Tasks } from "src/app/types/task"

@Component({
	selector: "app-task-container",
	templateUrl: "./task-container.component.html",
	styleUrls: ["./task-container.component.css"],
})
export class TaskContainerComponent implements OnInit {
	@Input() isHomePage: boolean = false
	@Input() task: Tasks

	isAddSubTaskDialogVisible: boolean = false
	addSubTaskForm: FormGroup

	constructor(
		private fb: FormBuilder,
		private taskService: TaskService,
		private message: MessageService,
	) {}

	ngOnInit(): void {
		this.addSubTaskForm = this.fb.group({
			subTaskName: ["", Validators.required],
			subTaskDueDate: [""],
			subTaskPriority: ["", Validators.required],
		})
	}

	showAddSubTaskDialog(): void {
		this.isAddSubTaskDialogVisible = true
	}

	addSubTask(): void {
		this.taskService
			.addSubTask(
				this.task.id,
				this.addSubTaskForm.value.subTaskName,
				this.addSubTaskForm.value.subTaskDueDate,
				this.addSubTaskForm.value.subTaskPriority,
			)
			.subscribe((subTask) => {
				// this.task.subTask.push(subTask)
				this.isAddSubTaskDialogVisible = false
				this.message.add({
					severity: "success",
					summary: "Task added!",
					detail: "More stuff to do now ;-;",
				})
			})
	}
}
