import { Component, OnInit } from "@angular/core"
import { CategoryService } from "src/app/services/category.service"
import { Category, CategoryType } from "src/app/types/category"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { UserService } from "src/app/services/user.service"
import { User, UserType } from "src/app/types/user"

@Component({
	selector: "app-navbar",
	templateUrl: "./navbar.component.html",
	styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
	user: User
	UserType = UserType
	categoryList: Category[] = []
	isAddDialogVisible: boolean = false
	addCategoryForm: FormGroup
	readonly CategoryType = CategoryType

	constructor(
		private categoryService: CategoryService,
		private userService: UserService,
		private fb: FormBuilder,
	) {}

	ngOnInit(): void {
		this.userService.getCurrentUser().subscribe((user) => {
			this.categoryService
				.getCategoryList(user.id)
				.subscribe((categoryList) => {
					this.categoryList = categoryList
					this.user = user
					console.log(categoryList)
				})
		})

		this.addCategoryForm = this.fb.group({
			categoryName: ["", Validators.required],
			categoryType: [],
		})
	}

	showAddDialog() {
		this.isAddDialogVisible = true
	}

	onSubmit() {
		const categoryType: CategoryType = this.addCategoryForm.value
			.categoryType
			? CategoryType.GRP
			: CategoryType.INDIV

		console.log(categoryType)

		this.categoryService
			.addCategory(
				this.user.id,
				this.addCategoryForm.value.categoryName,
				categoryType,
			)
			.subscribe((category) => this.categoryList.push(category))
		this.isAddDialogVisible = false
		this.addCategoryForm.reset()
	}
}
