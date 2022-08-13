import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { Category, CategoryMember } from "src/app/models/category"
import { Tasks } from "src/app/models/task"
import { Subscription } from "rxjs"
import { CategoryService } from "src/app/services/category.service"
import { TaskService } from "src/app/services/task.service"
import { ConfirmationService, MessageService } from "primeng/api"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { UserService } from "src/app/services/user.service"
import { User, UserType } from "src/app/models/user"

@Component({
	selector: "app-group-category",
	templateUrl: "./group-category.component.html",
	styleUrls: ["./group-category.component.css"],
})
export class GroupCategoryComponent implements OnInit {
	categoryId: string
	category: Category
	user: User
	members: CategoryMember[]
	taskList: Tasks[]
	newMemberUsername: string
	isSettingsDialogVisible: boolean = false
	isAddMemberDialogVisible: boolean = false
	isAddTaskDialogVisible: boolean = false
	categorySettingsForm: FormGroup
	addTaskForm: FormGroup
	priorityOptions: string[] = ["High", "Medium", "Low"]
	private routeSubscription: Subscription

	constructor(
		private route: ActivatedRoute,
		private userService: UserService,
		private categoryService: CategoryService,
		private taskService: TaskService,
		private confirmationService: ConfirmationService,
		private message: MessageService,
		private fb: FormBuilder,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.addTaskForm = this.fb.group({
			taskName: ["", Validators.required],
			taskDueDate: ["", Validators.required],
			taskPriority: ["", Validators.required],
		})

		this.routeSubscription = this.route.params.subscribe((params) => {
			console.log(params)
			this.categoryId = params["id"]

			this.categoryService
				.getCategoryById(this.categoryId)
				.subscribe((category) => {
					this.category = category
					this.members = category.members!
					this.userService.getCurrentUser().subscribe((user) => {
						this.user = user
						if (
							!this.category?.members?.some(
								(member) => member.userId === user._id,
							) &&
							this.category?.creatorId !== user._id
						) {
							this.router.navigate(["/404"])
						} else {
							this.members = this.category?.members!.filter(
								(member) => member.userId !== user._id,
							)
						}
					})

					this.taskService
						.getTaskByCategoryId(this.categoryId)
						.subscribe((tasks) => {
							this.taskList = tasks
							console.log(tasks)
						})

					this.categorySettingsForm = this.fb.group({
						categoryName: [
							this.category?.name,
							Validators.required,
						],
					})
				})
		})
	}

	showSettingsDialog() {
		if (this.user._id === this.category?.creatorId) {
			this.isSettingsDialogVisible = true
		} else {
			this.message.add({
				severity: "error",
				summary: "No UNLIMITED POWAAA for you",
				detail: "Only the creator can edit this category",
			})
		}
	}

	showAddMemberDialog() {
		this.isAddMemberDialogVisible = true
	}

	showAddTaskDialog() {
		this.isAddTaskDialogVisible = true
	}

	onEdit() {
		this.categoryService
			.updateCategory(
				this.categoryId,
				this.categorySettingsForm.value.categoryName,
			)
			.subscribe((res) => {
				this.category!.name = res.name
				this.isSettingsDialogVisible = false
				this.message.add({
					severity: "success",
					summary: "Updated!",
					detail: "Category has been edited successfully",
				})
			})
	}

	addMember() {
		this.userService.getAllUsers().subscribe((users) => {
			const newMember = users.find(
				(user) => user.username === this.newMemberUsername,
			)

			if (newMember) {
				if (newMember._id === this.user._id) {
					this.message.add({
						severity: "error",
						summary: "Thats... you?",
						detail: "You can't add yourself AGAIN to the category",
					})
				} else if (
					this.category.members?.some(
						(member) => member.userId === newMember._id,
					)
				) {
					this.message.add({
						severity: "error",
						summary: "Already a member",
						detail: "This user is already a member of this category",
					})
				} else if (newMember.type === UserType.FREE) {
					this.message.add({
						severity: "error",
						summary: "Man's broke",
						detail: "Only Pro and Pro+ users can be added to group categories",
					})
				} else {
					this.categoryService
						.addMember(
							this.categoryId,
							newMember._id,
							newMember.username,
						)
						.subscribe(
							(res) => {
								console.log(res)
								this.isAddMemberDialogVisible = false
								this.isSettingsDialogVisible = false
								this.newMemberUsername = ""
								this.message.add({
									severity: "success",
									summary: `${newMember.username} has joined the game`,
									detail: "User has been added to this category",
								})
								this.members.push({
									userId: newMember._id,
									username: newMember.username,
								})
							},
							(err) => {
								console.error(err)
								this.message.add({
									severity: "error",
									summary: "Something went wrong",
									detail: `Unable to add ${newMember.username} to the category`,
								})
							},
						)
				}
			} else {
				this.message.add({
					severity: "error",
					summary: "Who?",
					detail: "No user found with that username",
				})
			}
		})
	}

	removeMember(member: CategoryMember) {
		if (member.userId === this.user._id) {
			this.message.add({
				severity: "error",
				summary: "You can't delete yourself",
				detail: "You can't leave your own category.",
			})
		} else {
			this.confirmationService.confirm({
				header: "Remove member",
				message: `Are you sure you want to remove ${member.username} from this category?`,
				accept: () => {
					this.categoryService
						.removeMember(this.categoryId, member.userId)
						.subscribe(
							(res) => {
								console.log(res)
								this.isAddMemberDialogVisible = false
								this.isSettingsDialogVisible = false
								this.members = this.members.filter(
									(m) => m.userId !== member.userId,
								)
								console.log(this.members)
								this.message.add({
									severity: "success",
									summary: "YEET!",
									detail: `${member.username} has been removed from this category`,
								})
							},
							(err) => {
								console.error(err)
								this.message.add({
									severity: "error",
									summary: "Something went wrong",
									detail: `${member.username} could not be removed from this category`,
								})
							},
						)
				},
			})
		}
	}

	deleteCategory() {
		this.confirmationService.confirm({
			header: "Delete category",
			message:
				"Are you sure you want to delete this category? ALL TASKS WILL BE PERMANENTLY DELETED. This is NOT reversible",

			accept: () => {
				this.categoryService.deleteCategory(this.categoryId).subscribe(
					(response) => {
						this.isSettingsDialogVisible = false
						this.router.navigate(["/home"])
						this.message.add({
							severity: "success",
							summary: "YEET!",
							detail: "Category has been deleted",
						})
					},
					(error) => {
						this.message.add({
							severity: "error",
							summary: "Error",
							detail: "Oops Something went wrong",
						})
					},
				)
			},
		})
	}

	addTask() {
		this.taskService
			.addTask(
				this.categoryId,
				this.user._id,
				this.addTaskForm.value.taskName,
				this.addTaskForm.value.taskDueDate,
				this.addTaskForm.value.taskPriority,
			)
			.subscribe((task) => {
				console.log(task.dueDate)
				this.taskList.push(task)
				this.isAddTaskDialogVisible = false
				this.addTaskForm.reset()
				this.message.add({
					severity: "success",
					summary: "Task added!",
					detail: "More stuff to do now ;-;",
				})
			})
	}

	// ngOnDestroy() {
	// 	this.routeSubscription.unsubscribe()
	// }
}
