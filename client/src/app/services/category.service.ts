import { Injectable } from "@angular/core"
import { Category } from "../types/category"
import { Observable, of } from "rxjs"

@Injectable({
	providedIn: "root",
})
export class CategoryService {
	private categoryList: Category[] = [
		{
			id: 1,
			categoryName: "FWEB",
		},
		{
			id: 2,
			categoryName: "MBAP",
		},
		{
			id: 3,
			categoryName: "AMDT",
		},
		{
			id: 4,
			categoryName: "Test",
		},
	]

	constructor() {}

	getCategoryList(): Observable<Category[]> {
		const categoryList = of(this.categoryList)
		return categoryList
	}

	getCategoryById(id: number): Observable<Category> {
		const category = of(
			this.categoryList.find((category) => category.id == id)!,
		)
		return category
	}

	addCategory(categoryName: string): void {
		this.categoryList.push({
			id: this.categoryList.length + 1,
			categoryName: categoryName,
		})
	}

	editCategory(category: Category): Observable<Category> {
		const index = this.categoryList.findIndex((c) => c.id == category.id)
		this.categoryList[index] = category

		return of(this.categoryList[index])
	}

	deleteCategory(id: number): void {
		const index = this.categoryList.findIndex((c) => c.id == id)
		this.categoryList.splice(index, 1)
	}
}
