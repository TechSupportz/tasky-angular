import { Component, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { Category } from "src/app/types/category"
import { Tasks } from "src/app/types/task"
import { Subscription } from "rxjs"
import { CategoryService } from "src/app/services/category.service"
import { TaskService } from "src/app/services/task.service"

@Component({
	selector: "app-group-category",
	templateUrl: "./group-category.component.html",
	styleUrls: ["./group-category.component.css"],
})
export class GroupCategoryComponent implements OnInit {
	categoryId: number
	category?: Category
	taskList: Tasks[]
	private routeSubscription: Subscription

	constructor(
		private route: ActivatedRoute,
		private categoryService: CategoryService,
		private taskService: TaskService,
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
		})
	}

	showAddTaskDialog() {
		console.log('bruh')
	}
}
