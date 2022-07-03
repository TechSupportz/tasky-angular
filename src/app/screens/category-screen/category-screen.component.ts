import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category-screen',
  templateUrl: './category-screen.component.html',
  styleUrls: ['./category-screen.component.css'],
})
export class CategoryScreenComponent implements OnInit {
  categoryName: any;
  private routeSubscription!: Subscription;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      console.log(params);
      this.categoryName = params['categoryName'];
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
}
