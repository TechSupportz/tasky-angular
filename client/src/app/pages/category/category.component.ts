import { Component, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { Subscription } from "rxjs"
import { CategoryService } from "src/app/services/category.service"
import { Category } from "src/app/types/category"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ConfirmationService } from "primeng/api"

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
    private fb: FormBuilder,
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

  onEdit(){
    console.log("balls");
    
  }

  deleteCategory() {
    this.confirmationService.confirm({
		message:
			"Are you sure you want to delete this category? This is NOT reversible",
		accept: () => {
			this.categoryService.deleteCategory(this.categoryId)
		},
	})
  }

	ngOnDestroy() {
		this.routeSubscription.unsubscribe()
	}
}
