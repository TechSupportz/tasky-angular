import { Component, OnInit } from "@angular/core"
import {
	ActivatedRoute,
	NavigationEnd,
	Event,
	Router,
	NavigationStart,
} from "@angular/router"
import { Subscription } from "rxjs"

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})
export class AppComponent {
	title = "Tasky"
	isNavbarVisible: boolean
	event$: any

	constructor(private router: Router) {
		router.events.subscribe((event: Event) => {
			if (event instanceof NavigationStart) {
				console.log(event.url)
        this.isNavbarVisible = event.url !== "/" && event.url !== "/login" && event.url !== "/404"
			}
		})
	}

	ngOnDestroy() {
		this.event$.unsubscribe()
	}
}
