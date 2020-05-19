import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppTaskComponent} from './app-task/app-task.component';


const routes: Routes = [
  { path: 'task/:id', component: AppTaskComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
