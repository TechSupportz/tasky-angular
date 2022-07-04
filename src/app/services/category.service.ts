import { Injectable } from '@angular/core';
import { Category } from '../types/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categoryList: Category[] = [
    {
      id: 1,
      categoryName: 'FWEB',
    },
    {
      id: 2,
      categoryName: 'MBAP',
    },
    {
      id: 3,
      categoryName: 'AMDT',
    },
    {
      id: 4,
      categoryName: 'Test',
    },
  ];

  constructor() {}

  getCategoryList(): Category[] {
    return this.categoryList;
  }

  getCategoryById(id: number) {
    return this.categoryList.find((category) => category.id == id);
  }

  addCategory(category: Category): void {
    this.categoryList.push(category);
  }
}
