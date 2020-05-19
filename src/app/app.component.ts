import {Component, OnInit} from '@angular/core';
import {TaskService} from './Services/task.service';
import {ModelFolder} from './Models/ModelFolder';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TimeTracker';
  constructor(private taskService: TaskService) {
  }

  ngOnInit() {
    this.getService().setup();
  }

  onEnter(value: string) {
    this.taskService.createFolder(value);
  }

  quick() {
    this.taskService.createQuickTask();
  }

  getService() {
    return this.taskService;
  }


}










