import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrimengModule } from '../primeng.module';
import { LoginComponent } from './pages/login/login.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CategoryComponent } from './pages/category/category.component';
import { GroupCategoryComponent } from './pages/group-category/group-category.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService } from "primeng/api"


@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		HomeComponent,
		NavbarComponent,
		CategoryComponent,
		GroupCategoryComponent,
	],
	imports: [
		BrowserAnimationsModule,
		BrowserModule,
		AppRoutingModule,
		FlexLayoutModule,
		PrimengModule,
		ReactiveFormsModule,
	],
	providers: [ConfirmationService],
	bootstrap: [AppComponent],
})
export class AppModule {}
