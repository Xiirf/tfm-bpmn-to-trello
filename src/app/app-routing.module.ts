import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaveTokenComponent } from './pages/saveToken/save-token.component';
import { HomePageComponent } from './pages/homePage/home-page.component';


const routes: Routes = [
  { path: 'saveToken', component: SaveTokenComponent },
  { path: '', component: HomePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
