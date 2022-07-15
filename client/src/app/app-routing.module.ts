import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { CategoryComponent } from "./pages/category/category.component"
import { GroupCategoryComponent } from "./pages/group-category/group-category.component"
import { HomeComponent } from "./pages/home/home.component"
import { LoginComponent } from "./pages/login/login.component"

const routes: Routes = [
	{ path: "login", component: LoginComponent },
	{ path: "", component: LoginComponent },
	{ path: "home", component: HomeComponent },
	{ path: "category/:id", component: CategoryComponent },
	{ path: "group/:id", component: GroupCategoryComponent },
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
