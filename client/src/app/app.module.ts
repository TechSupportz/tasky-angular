import { NgModule } from "@angular/core"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { BrowserModule } from "@angular/platform-browser"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { PrimengModule } from "../primeng.module"
import { LoginComponent } from "./pages/login/login.component"
import { FlexLayoutModule } from "@angular/flex-layout"
import { HomeComponent } from "./pages/home/home.component"
import { NavbarComponent } from "./components/navbar/navbar.component"
import { CategoryComponent } from "./pages/category/category.component"
import { GroupCategoryComponent } from "./pages/group-category/group-category.component"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ConfirmationService } from "primeng/api"
import { MessageService } from "primeng/api"
import { TaskComponent } from "./components/task/task.component"
import { TaskContainerComponent } from "./components/task-container/task-container.component"
import { CommonModule } from "@angular/common"
import { CalendarComponent } from "./components/calendar/calendar.component"
import { CalendarModule } from "primeng/calendar"
import { DatePipe } from "@angular/common"


@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		HomeComponent,
		NavbarComponent,
		CategoryComponent,
		GroupCategoryComponent,
		TaskComponent,
		TaskContainerComponent,
		CalendarComponent,
	],
	imports: [
		BrowserAnimationsModule,
		BrowserModule,
		AppRoutingModule,
		FlexLayoutModule,
		PrimengModule,
		ReactiveFormsModule,
		CommonModule,
		FormsModule,
		CalendarModule,
	],
	providers: [ConfirmationService, MessageService, DatePipe],
	bootstrap: [AppComponent],
})
export class AppModule {}
