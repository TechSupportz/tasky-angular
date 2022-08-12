import { Injectable } from "@angular/core"
import { Category, CategoryType } from "../models/category"
import { Observable, of, Subject } from "rxjs"
import { categoryList } from "../mock-data/mock-category"
import { User } from "../models/user"
import { TaskService } from "./task.service"
import { HttpClient } from "@angular/common/http"
import { APIConfig } from "./apiConfig"

@Injectable({
	providedIn: "root",
})
export class CategoryService {
	constructor(private taskService: TaskService, private http: HttpClient) {}

	getCategoryByUserId(userId: string): Observable<Category[]> {
		return this.http.get<Category[]>(
			`${APIConfig.BASE_URL}/category/user/${userId}`,
		)
	}

	getCategoryById(id: string): Observable<Category> {
		return this.http.get<Category>(`${APIConfig.BASE_URL}/category/${id}`)
	}

	isGroupCategory(categoryId: string): boolean {
		const category = categoryList.find(
			(category) => category._id == categoryId,
		)
		return category?.type == CategoryType.GRP
	}

	addCategory(
		creatorId: string,
		creatorUsername: string,
		categoryName: string,
		categoryType: CategoryType,
	): Observable<Category> {
		return this.http.post<Category>(`${APIConfig.BASE_URL}/category/add`, {
			creatorId: creatorId,
			name: categoryName,
			type: categoryType,
		})
	}

	addMember(categoryId: string, user: User): void {
		const category = categoryList.find((c) => c._id == categoryId)
		if (category?.members) {
			category.members?.push({
				userId: user._id,
				username: user.username,
			})
		}
	}

	removeMember(categoryId: string, userId: string): void {
		const category = categoryList.find((c) => c._id == categoryId)
		if (category?.members) {
			const index = category.members.findIndex(
				(member) => member.userId == userId,
			)
			category.members.splice(index, 1)
		}
	}

	editCategory(category: Category): Observable<Category> {
		const index = categoryList.findIndex((c) => c._id == category._id)
		categoryList[index] = category

		return of(categoryList[index])
	}

	private deletedIndex: Subject<number> = new Subject<number>()
	public readonly notifyDeleteCategory$: Observable<number> =
		new Subject<number>()

	deleteCategory(id: string): void {
		const index = categoryList.findIndex((c) => c._id == id)
		categoryList.splice(index, 1)
		this.taskService.deleteTaskByCategoryId(id)
	}
}
