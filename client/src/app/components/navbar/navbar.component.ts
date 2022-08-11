import { Component, OnInit, SimpleChanges } from "@angular/core"
import { CategoryService } from "src/app/services/category.service"
import { Category, CategoryType } from "src/app/models/category"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { UserService } from "src/app/services/user.service"
import { User, UserType } from "src/app/models/user"
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router"
import { Subscription } from "rxjs"

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
	isDisabled: boolean = false
	private routeSubscription: Subscription

	constructor(
		private categoryService: CategoryService,
		private userService: UserService,
		private fb: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
	) {
		this.router.events.subscribe((e) => {
			if (e instanceof NavigationEnd) {
				this.ngOnInit()
			}
		})
	}

	ngOnInit(): void {
		this.userService.getCurrentUser().subscribe((user) => {
			if (user) {
				this.categoryService
					.getCategoryList(user._id)
					.subscribe((categoryList) => {
						this.categoryList = categoryList
						this.user = user
						console.log(categoryList)
					})

				this.isDisabled =
					this.user.type === UserType.FREE &&
					this.categoryList.length >= 8
			} 
		})

		this.addCategoryForm = this.fb.group({
			categoryName: ["", Validators.required],
			categoryType: [],
		})
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.categoryList) {
			this.isDisabled =
				this.user.type === UserType.FREE &&
				this.categoryList.length >= 8
		}
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
				this.user._id,
				this.user.username,
				this.addCategoryForm.value.categoryName,
				categoryType,
			)
			.subscribe((category) => this.categoryList.push(category))
		this.isAddDialogVisible = false
		this.addCategoryForm.reset()
	}
}
