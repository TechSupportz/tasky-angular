import { Injectable } from "@angular/core"
import { Category, CategoryType } from "../models/category"
import { Observable, of, Subject } from "rxjs"
import { categoryList } from "../mock-data/mock-category"
import { User } from "../models/user"
import { TaskService } from "./task.service"

@Injectable({
	providedIn: "root",
})
export class CategoryService {
	constructor(private taskService: TaskService) {}

	getCategoryList(userId: string): Observable<Category[]> {
		return of(
			categoryList.filter((category) => {
				if (category.type == CategoryType.GRP) {
					return category.members?.find(
						(member) => member.userId === userId,
					)
				} else {
					console.log(category._id)
					if (category.creatorId == userId) {
						return category
					} else {
						return null
					}
				}
			}),
		)
	}

	getCategoryById(id: string): Observable<Category> {
		const category = of(
			categoryList.find((category) => category._id == id)!,
		)
		return category
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
		if (categoryType == CategoryType.INDIV) {
			categoryList.push({
				_id: Math.random().toString(36).substr(2, 9),
				creatorId: creatorId,
				name: categoryName,
				type: categoryType,
			})
		} else {
			categoryList.push({
				_id: Math.random().toString(36).substr(2, 9),
				creatorId: creatorId,
				name: categoryName,
				type: categoryType,
				members: [
					{
						userId: creatorId,
						username: creatorUsername,
					},
				],
			})
		}

		return of(categoryList[categoryList.length - 1])
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
