import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs"
import { userList } from "../mock-data/mock-user"
import { User, UserType } from "../models/user"
import { HttpClient, HttpEvent } from "@angular/common/http"
import { APIConfig } from "./apiConfig"
import { Router } from "@angular/router"

@Injectable({
	providedIn: "root",
})
export class UserService {
	currentUser: User
	isLoggedIn: boolean

	constructor(private http: HttpClient, private router: Router) {}

	getIsLoggedIn() {
		return this.isLoggedIn
	}

	getUserType(): UserType {
		return this.currentUser!.type
	}

	
	// ONLY HERE FOR TESTING PURPOSES,TO BE REMOVED IN FINAL VERSION
	getAllUsers(): User[] {
		return userList
	}

	authenticateUser(username: string, password: string): Observable<any> {
		return this.http.post<User>(`${APIConfig.BASE_URL}/user/login`, {
			username: username,
			password: password,
		})
	}

	registerUser(user: User): Observable<any> {
		return this.http.post<User>(`${APIConfig.BASE_URL}/user/register`, user)
	}

	updateUser(user: User): Observable<any> {
		return this.http.put<User>(
			`${APIConfig.BASE_URL}/user/${this.currentUser!._id}/update`,
			{ username: user.username, email: user.email, type: user.type },
		)
	}

	updatePassword(oldPassword: string, newPassword: string): Observable<any> {
		return this.http.put<any>(
			`${APIConfig.BASE_URL}/user/${
				this.currentUser!._id
			}/update/password`,
			{ oldPassword: oldPassword, newPassword: newPassword },
		)
	}

	getUserById(id: string): Observable<User> {
		return this.http.get<User>(`${APIConfig.BASE_URL}/user/${id}`)
	}

	getUserByUsername(username: string): Observable<User> {
		return of(userList.find((user) => user.username == username)!)
	}

	getCurrentUser(): Observable<User> {
		if (this.isLoggedIn) {
			return of(this.currentUser)
		} else {
			return this.http.get<User>(`${APIConfig.BASE_URL}/user/${localStorage.getItem("userId")}`)
		}
	}

	setCurrentUser(user: User): void {
		this.currentUser = user
		localStorage.setItem("userId", user._id)
	}

	setIsLoggedIn(isLoggedIn: boolean): void {
		this.isLoggedIn = isLoggedIn
	}

	deleteAccount(): Observable<any> {
		return this.http.delete<any>(`${APIConfig.BASE_URL}/user/${this.currentUser!._id}/delete`)
		
	}

	logout(): void {
		localStorage.removeItem("userId")
		this.isLoggedIn = false
		this.router.navigate(["/"])
	}
}
