import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { CategoryComponent } from "./pages/category/category.component"
import { GroupCategoryComponent } from "./pages/group-category/group-category.component"
import { HomeComponent } from "./pages/home/home.component"
import { LoginComponent } from "./pages/login/login.component"
import { RegisterComponent } from "./pages/register/register.component"
import { NotFound404Component } from "./pages/not-found404/not-found404.component"
import { ProfileComponent } from "./pages/profile/profile.component"

const routes: Routes = [
	{ path: "login", component: LoginComponent },
	{ path: "", redirectTo: "/login", pathMatch: "full" },
	{ path: "register", component: RegisterComponent },
	{ path: "profile", component: ProfileComponent },
	{ path: "home", component: HomeComponent },
	{ path: "category/:id", component: CategoryComponent },
	{ path: "group/:id", component: GroupCategoryComponent },
	{ path: "404", component: NotFound404Component },
	{ path: "**", redirectTo: "/404", pathMatch: "full" },
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
