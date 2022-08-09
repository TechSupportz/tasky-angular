import { Component, OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { UserService } from "src/app/services/user.service"
import { User } from "src/app/models/user"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MessageService } from "primeng/api"
import { HttpErrorResponse } from "@angular/common/http"

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
	userList: User[]
	selectedUser: number
	loginForm: FormGroup

	constructor(
		private userService: UserService,
		private router: Router,
		private fb: FormBuilder,
		private message: MessageService,
	) {}

	ngOnInit(): void {
		this.loginForm = this.fb.group({
			username: ["", Validators.required],
			password: ["", Validators.required],
		})

		this.userList = this.userService.getAllUsers()
	}

	authenticateUser() {
		const { username, password } = this.loginForm.value

		this.userService.authenticateUser(username, password).subscribe(
			(response: User) => {
				this.message.add({
					severity: "success",
					summary: "Login Successful",
					detail: `Hello ${response.username}`,
				})
				this.userService.setCurrentUser(response)
				this.router.navigate(["/home"])
			},
			(error: HttpErrorResponse) => {
				console.log(error.error)
				this.message.add({
					severity: "error",
					summary: "Login Failed",
					detail: error.error,
				})
			},
		)
	}
}
