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
		categoryName: string,
		categoryType: CategoryType,
	): Observable<Category> {
		return this.http.post<Category>(`${APIConfig.BASE_URL}/category/add`, {
			creatorId: creatorId,
			name: categoryName,
			type: categoryType,
		})
	}

	addMember(
		categoryId: string,
		userId: string,
		username: string,
	): Observable<any> {
		return this.http.put(
			`${APIConfig.BASE_URL}/category/${categoryId}/addMember`,
			{
				userId: userId,
				username: username,
			},
		)
	}

	removeMember(categoryId: string, userId: string): Observable<any> {
		return this.http.delete(
			`${APIConfig.BASE_URL}/category/${categoryId}/removeMember/${userId}`,
		)
	}

	updateCategory(id: string, newName: string): Observable<any> {
		return this.http.put(`${APIConfig.BASE_URL}/category/${id}/update`, {
			name: newName,
		})
	}

	private deletedIndex: Subject<number> = new Subject<number>()
	public readonly notifyDeleteCategory$: Observable<number> =
		new Subject<number>()

	deleteCategory(id: string, boardId?: string): Observable<any> {
		return this.http.delete(`${APIConfig.BASE_URL}/category/${id}/delete`, {
			body: boardId ? { boardId: boardId } : null,
		})
	}
}
