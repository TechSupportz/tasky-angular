import { Component, OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { UserService } from "src/app/services/user.service"
import { User } from "src/app/models/user"

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
	userList: User[]
	selectedUser: number

	constructor(private userService: UserService, private router: Router) {}

	ngOnInit(): void {
		this.userList = this.userService.getAllUsers()
	}

	goToHome(): void {
		this.userService
			.getUserById(this.selectedUser)
			.subscribe((user) => this.userService.setCurrentUser(user))

		localStorage.setItem("userId", this.selectedUser.toString())
		this.router.navigate(["/home"])
	}
}
