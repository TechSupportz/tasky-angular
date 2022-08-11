import { Injectable } from "@angular/core"
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
	UrlTree,
} from "@angular/router"
import { Observable } from "rxjs"
import { UserService } from "./services/user.service"

@Injectable({
	providedIn: "root",
})
export class AuthGuard implements CanActivate {
	constructor(private userService: UserService, private router: Router) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
	):
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		// const permission = route.data["permission"]

		if (this.userService.getIsLoggedIn()) {
			return true
		} else {
			this.router.navigate(["/login"])
			return false
		}
	}
}
