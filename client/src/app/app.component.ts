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

	constructor(
		private router: Router,
		private userService: UserService,
		private cd: ChangeDetectorRef,
	) {
		router.events.subscribe((event: Event) => {
			userService.getCurrentUser().subscribe((user) => {
				if (!user) {
					userService
						.getUserById(parseInt(localStorage.getItem("userId")!))
						.subscribe((user) =>
							this.userService.setCurrentUser(user),
						)
				}
			})

			if (event instanceof NavigationStart) {
				console.log(event.url)
				this.isNavbarVisible =
					event.url !== "/" && event.url !== "/login"
			}
		})
	}

	ngOnDestroy() {
		this.event$.unsubscribe()
	}
}
