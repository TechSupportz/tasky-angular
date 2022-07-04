import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/types/category';

@Component({
  selector: 'app-category-screen',
  templateUrl: './category-screen.component.html',
  styleUrls: ['./category-screen.component.css'],
})
export class CategoryScreenComponent implements OnInit {
  categoryId: any;
  category?: Category;
  private routeSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      console.log(params);
      this.categoryId = params['id'];
      this.category = this.categoryService.getCategoryById(this.categoryId);
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
}
