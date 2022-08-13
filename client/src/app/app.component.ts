import { ChangeDetectorRef, Component, OnInit } from "@angular/core"
import {
	ActivatedRoute,
	NavigationEnd,
	Event,
	Router,
	NavigationStart,
} from "@angular/router"
import { Subscription } from "rxjs"
import { UserService } from "./services/user.service"

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})
export class AppComponent {
	title = "Tasky"
	isNavbarVisible: boolean
	event$: any
	isLoading: boolean = false

	constructor(
		private router: Router,
		private userService: UserService,
		private cd: ChangeDetectorRef,
	) {
		router.events.subscribe((event: Event) => {
			// console.log(userService.getIsLoggedIn())
			if (event instanceof NavigationStart) {
				console.log(event.url)
				this.isNavbarVisible =
					event.url !== "/" &&
					event.url !== "/login" &&
					event.url !== "/register"

				if (!this.isNavbarVisible) {
					userService.getCurrentUser().subscribe((user) => {
						console.log(user)
						userService
							.getUserById(localStorage.getItem("userId")!)
							.subscribe((user) => {
								userService.setCurrentUser(user)
								userService.setIsLoggedIn(true)
							})
					})
				}
			}
			if (!router.navigated) {
				if (
					router.url !== "/" &&
					router.url !== "/login" &&
					router.url !== "/register"
				) {
					this.isLoading = true
					userService
						.getUserById(localStorage.getItem("userId")!)
						.subscribe((user) => {
							userService.setCurrentUser(user)
							userService.setIsLoggedIn(true)
							setTimeout(() => (this.isLoading = false), 500)
						})
				}
			}
		})
	}

	ngOnDestroy() {
		this.event$.unsubscribe()
	}
}
