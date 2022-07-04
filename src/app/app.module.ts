import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrimengModule } from '../primeng.module';
import { LoginScreenComponent } from './screens/login-screen/login.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeScreenComponent } from './screens/home-screen/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CategoryScreenComponent } from './screens/category-screen/category-screen.component';
import { GroupCategoryComponent } from './screens/group-category/group-category.component';

@NgModule({
  declarations: [AppComponent, LoginScreenComponent, HomeScreenComponent, NavbarComponent, CategoryScreenComponent, GroupCategoryComponent],
  imports: [BrowserModule, AppRoutingModule, FlexLayoutModule, PrimengModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
