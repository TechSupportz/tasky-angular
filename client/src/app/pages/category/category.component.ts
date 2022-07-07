import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { Subscription } from "rxjs"
import { CategoryService } from "src/app/services/category.service"
import { Category } from "src/app/types/category"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ConfirmationService, MessageService } from "primeng/api"

@Component({
	selector: "app-category",
	templateUrl: "./category.component.html",
	styleUrls: ["./category.component.css"],
})
export class CategoryComponent implements OnInit {
	categoryId: any
	category?: Category
	isSettingsDialogVisible: boolean = false
	categorySettingsForm: FormGroup
	private routeSubscription!: Subscription

	constructor(
		private route: ActivatedRoute,
		private categoryService: CategoryService,
		private confirmationService: ConfirmationService,
		private messageService: MessageService,
		private fb: FormBuilder,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.routeSubscription = this.route.params.subscribe((params) => {
			console.log(params)
			this.categoryId = params["id"]
			this.category = this.categoryService.getCategoryById(
				this.categoryId,
			)
		})

		this.categorySettingsForm = this.fb.group({
			categoryName: ["", Validators.required],
		})
	}

	showSettingsDialog() {
		this.isSettingsDialogVisible = true
	}

	onEdit() {
		console.log("balls")
	}

	deleteCategory() {
		this.confirmationService.confirm({
			message:
				"Are you sure you want to delete this category? This is NOT reversible",
			accept: () => {
				this.categoryService.deleteCategory(this.categoryId)
				this.isSettingsDialogVisible = false
				this.router.navigate(["/home"])
				this.messageService.add({
					severity: "success",
					summary: "Poof!",
					detail: "Category deleted successfully",
				})
			},
		})
	}

	ngOnDestroy() {
		this.routeSubscription.unsubscribe()
	}
}
