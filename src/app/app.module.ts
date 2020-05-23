import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppTaskComponent } from './app-task/app-task.component';
import { AppTaskFolderComponent } from './app-task-folder/app-task-folder.component';
import {RouterModule, Routes} from '@angular/router';
import {TaskService} from './Services/task.service';






@NgModule({
  declarations: [
    AppComponent,
    AppTaskComponent,
    AppTaskFolderComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

  ],
  providers: [TaskService],
  bootstrap: [AppComponent]


})

export class AppModule {

}

