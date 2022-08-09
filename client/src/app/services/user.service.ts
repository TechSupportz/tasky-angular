import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs"
import { userList } from "../mock-data/mock-user"
import { User, UserType } from "../models/user"
import { HttpClient, HttpEvent } from "@angular/common/http"
import { APIConfig } from "./apiConfig"

@Injectable({
	providedIn: "root",
})
export class UserService {
	currentUser: User

	constructor(private http: HttpClient) {}

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

	getCurrentUser(): Observable<User> {
		return of(this.currentUser)
	}

	getUserById(id: string): Observable<User> {
		return of(userList.find((user) => user._id == id)!)
	}

	getUserByUsername(username: string): Observable<User> {
		return of(userList.find((user) => user.username == username)!)
	}

	setCurrentUser(user: User): void {
		this.currentUser = user
	}
}
