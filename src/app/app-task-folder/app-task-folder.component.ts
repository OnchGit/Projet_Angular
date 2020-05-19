import { Component, Input, OnInit } from '@angular/core';
import {AppTaskComponent} from '../app-task/app-task.component';
import {ActivatedRoute} from '@angular/router';
import {TaskService} from '../Services/task.service';




@Component({
  selector: 'app-task-folder',
  templateUrl: './app-task-folder.component.html',
  styleUrls: ['./app-task-folder.component.css']
})
export class AppTaskFolderComponent implements OnInit {
  @Input() TaskFolderName: string;
  @Input() TaskFolderTotalTime: string;
  @Input() TaskFolderContentIsVisible = false;
  @Input() id: number;
  createTask = false;
  edit = false;
  interval = 0;
  @Input() showCommands = true;
  @Input() showSelector = false;
  @Input() ParentTaskID: number;
  @Input() canEdit = true;
  _reload = true;


  constructor(private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.TaskFolderTotalTime = this.getService().convertSecondsToTime(this.getService().getFolderTotalTime(this.id));
      this.reload();
    }, 1000);
  }

  // handles showing the tasks in the folder
  showContent() {
    const tmp = this.getService().getTasksFromFolder(this.id).length;
    if (tmp > 0 || (this.TaskFolderContentIsVisible && tmp >= 0)) {
      this.TaskFolderContentIsVisible = !this.TaskFolderContentIsVisible;
    }

  }

  // creates a new task for the folder
  onEnter(value: string) {
    this.taskService.createTask(value, this.id);
    this.creaLogic();
  }

  editName(value: string){
    this.getService().editFolderName(this.id, value);
    this.editLogic();
  }

  getService() {
    return this.taskService;
  }

  editLogic() {
    this.edit = !this.edit;
  }

  creaLogic() {
    this.createTask = !this.createTask;
  }

  timeHandler() {
    this.TaskFolderTotalTime =  this.getService().convertSecondsToTime(this.getService().getFolderTotalTime(this.id));
  }

  selectorLogic() {
    this.getService().changeFolder(this.ParentTaskID, this.id);
  }

  private reload() {
    setTimeout(() => this._reload = false);
    setTimeout(() => this._reload = true);
  }

}
