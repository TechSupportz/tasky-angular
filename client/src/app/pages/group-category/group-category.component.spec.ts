import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCategoryComponent } from './group-category.component';

describe('GroupCategoryComponent', () => {
  let component: GroupCategoryComponent;
  let fixture: ComponentFixture<GroupCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
