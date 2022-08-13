import { CurrencyPipe } from "@angular/common"
import { Injectable } from "@angular/core"
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
	UrlTree,
} from "@angular/router"
import { MessageService } from "primeng/api"
import { Observable } from "rxjs"
import { UserService } from "./services/user.service"

@Injectable({
	providedIn: "root",
})
export class AuthGuard implements CanActivate {
	constructor(
		private userService: UserService,
		private router: Router,
		private message: MessageService,
	) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
	):
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		const permission = route.data["permission"]

		return new Promise(async (resolve, reject) => {
			if (
				this.userService.getIsLoggedIn()
			) {
				this.userService.getUserFromLocalStorage().subscribe(
					(user) => {
						if (permission.only.includes(user.type)){
							resolve(true)
						} else {
							this.message.add({
								severity: "error",
								summary:
									"You do not have permission to access this page",
								detail: "Please upgrade your account to Pro or Pro+ via the profile page to access this page",
								closable: false,
								life: 5000,
							})
							this.router.navigate(["/404"])
							resolve(false)
						}
					}
				)
			} else {
				this.message.add({
					severity: "error",
					summary: "You do not have permission to access this page",
					detail: "Please upgrade your account to Pro or Pro+ via the profile page to access this page",
					closable: false,
					life: 5000,
				})
				this.router.navigate(["/404"])
				resolve(false)
			}
		})
	}
}
