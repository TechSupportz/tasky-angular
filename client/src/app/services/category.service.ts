import { Injectable } from "@angular/core"
import { Category, CategoryType } from "../types/category"
import { Observable, of } from "rxjs"
import { categoryList } from "../mock-data/mock-category"

@Injectable({
	providedIn: "root",
})
export class CategoryService {
	constructor() {}

	getCategoryList(): Observable<Category[]> {
		return of(categoryList)
	}

	getCategoryById(id: number): Observable<Category> {
		const category = of(categoryList.find((category) => category.id == id)!)
		return category
	}

	addCategory(categoryName: string, categoryType: CategoryType): void {
		categoryList.push({
			id: categoryList.length + 1,
			name: categoryName,
			type: categoryType,
		})
	}

	editCategory(category: Category): Observable<Category> {
		const index = categoryList.findIndex((c) => c.id == category.id)
		categoryList[index] = category

		return of(categoryList[index])
	}

	deleteCategory(id: number): void {
		const index = categoryList.findIndex((c) => c.id == id)
		categoryList.splice(index, 1)
	}
}
