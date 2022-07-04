import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryScreenComponent } from './screens/category-screen/category-screen.component';
import { HomeScreenComponent } from './screens/home-screen/home.component';
import { LoginScreenComponent } from './screens/login-screen/login.component';

const routes: Routes = [
  { path: 'login', component: LoginScreenComponent },
  { path: '', component: LoginScreenComponent },
  { path: 'home', component: HomeScreenComponent },
  { path: 'category/:id', component: CategoryScreenComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
