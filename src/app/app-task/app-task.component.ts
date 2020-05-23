import { Component, Input, OnInit } from '@angular/core';
import {TaskService} from '../Services/task.service';
import {ActivatedRoute} from '@angular/router';
import {ModelTask} from '../Models/ModelTask';
import {isUndefined} from 'util';


@Component({
  selector: 'app-task',
  templateUrl: './app-task.component.html',
  styleUrls: ['./app-task.component.css']
})
export class AppTaskComponent implements OnInit {
  @Input() TaskTitle: string;
  @Input() TaskTime: number;
  @Input() TaskSubTitle: string;
  @Input()TaskSubID: number;
  @Input()interval;
  @Input()TaskRenderTimer: string;
  @Input() isRunning ;
  @Input() id: number;
  edit = false;
  @Input() isQuick: boolean;
  changeFolder = false;
  _reload = true;

  // Starts the timer
  startTimer() {
  this.getService().startTimer(this.id);
  }

  // Pauses the timer
  pauseTimer() {
    //this._reload = false;
    this.getService().pauseTimer(this.id);
    console.log('TIMER PAUSED');
    this.isRunning = false;
    this.getService().getTaskFromID(this.id).isRunning = false;
    clearInterval(this.interval);
    this.interval = null;

  }

  // Converts time in seconds to human-readable time
  timerConvert() {
    if (isNaN(this.TaskTime)) {
      this.TaskTime = 0;
    }
    this.TaskRenderTimer = this.getService().convertSecondsToTime(this.TaskTime);
  }
 // Controls if the button starts or stop the timer
  buttonLogic() {
    if (!this.getService().getTaskFromID(this.id).isRunning) {
      this.startTimer();
    } else {
      this.pauseTimer();
    }
  }

  constructor(private taskService: TaskService  /*,private route?: ActivatedRoute*/) {
  }


  ngOnInit(): void {
    this.timerConvert();
    this.isRunning = this.getService().getTaskFromID(this.id).isRunning;
    this.interval = setInterval(() => {
      if (!isUndefined((this.getService().getTaskFromID(this.id)))) {
        this.TaskTime = this.getService().getTaskFromID(this.id).TaskTime;
        this.timerConvert();
        this.reload();
      }
    }, 1000);
  }


  onEnter(value: string) {
    this.taskService.editTaskName(this.id, value);
    this.editLogic();
  }

  getService() {
    return this.taskService;
  }

  delete() {
    this.pauseTimer();
    this.getService().pauseTimer(this.id);
    clearInterval(this.interval);
    clearInterval(this.getService().getTaskFromID(this.id).interval);
    this.getService().deleteTask(this.id);
  }

  editLogic() {
    this.edit = !this.edit;
  }
  changeFolderLogic() {
    this.changeFolder = !this.changeFolder;
  }


  private reload() {
    setTimeout(() => this._reload = false);
    setTimeout(() => this._reload = true);
  }

}
