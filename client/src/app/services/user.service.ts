import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs"
import { userList } from "../mock-data/mock-user"
import { User, UserType } from "../types/user"

@Injectable({
	providedIn: "root",
})
export class UserService {
	currentUser: User

	constructor() {}

	getCurrentUser(): Observable<User> {
		return of(this.currentUser)
	}

	setCurrentUser(user: User): void {
		this.currentUser = user
	}

	getUserById(id: number): Observable<User> {
		return of(userList.find((user) => user.id == id)!)
	}
}
