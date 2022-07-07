import { Component, OnInit } from "@angular/core"
import { CategoryService } from "src/app/services/category.service"
import { Category } from "src/app/types/category"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"

@Component({
	selector: "app-navbar",
	templateUrl: "./navbar.component.html",
	styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
	categoryList: Category[] = []
	isAddDialogVisible: boolean = false
	addCategoryForm: FormGroup

	constructor(
		private categoryService: CategoryService,
		private fb: FormBuilder,
	) {}

	ngOnInit(): void {
		this.categoryService.getCategoryList().subscribe(
			(categoryList) => {
				this.categoryList = categoryList
			}
		)

		this.addCategoryForm = this.fb.group({
			categoryName: ["", Validators.required],
		})
	}

	showAddDialog() {
		this.isAddDialogVisible = true
	}

	onSubmit() {
		this.categoryService.addCategory(
			this.addCategoryForm.value.categoryName,
		)
		this.isAddDialogVisible = false
	}
}
