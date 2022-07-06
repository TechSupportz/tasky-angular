import { Injectable } from "@angular/core"
import { Category } from "../types/category"

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

	getCategoryList(): Category[] {
		return this.categoryList
	}

	getCategoryById(id: number) {
		return this.categoryList.find((category) => category.id == id)
	}

	addCategory(categoryName: string): void {
		this.categoryList.push({
			id: this.categoryList.length + 1,
			categoryName: categoryName,
		})
	}

  editCategory(category: Category): void {
    const index = this.categoryList.findIndex(
      (c) => c.id == category.id
    )
    this.categoryList[index] = category
  }

  deleteCategory(id: number): void {
    const index = this.categoryList.findIndex((c) => c.id == id)
    this.categoryList.splice(index, 1)
  }
}
