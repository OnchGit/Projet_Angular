import { Component, Input, OnInit } from '@angular/core';
import {TaskService} from '../Services/task.service';
import {ActivatedRoute} from '@angular/router';
import {ModelTask} from '../Models/ModelTask';


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
  /*  this.getService().getTaskFromID(this.id).isRunning = true;
    this.interval = setInterval(() => {
      this.getService().getTaskFromID(this.id).TaskTime++;
      //this.TaskTime = this.getService().getTaskFromID(this.id).TaskTime;
      this.timerConvert();
      //this.getService().getTaskFromID(this.id).TaskTime = this.TaskTime;
      console.log('TOTAL' + this.id + ':' + this.TaskTime + ' BD:' + this.getService().getTaskFromID(this.id).TaskTime);
    }, 1000);*/
  this._reload = true;
  this.getService().startTimer(this.id);
  this.interval = setInterval(() => {
    this.TaskTime = this.getService().getTaskFromID(this.id).TaskTime;
    console.log('VIEW TIMER ' + this.TaskTime);
    this.reload();
    this.timerConvert();
  }, 1000);
  }

  // Pauses the timer
  pauseTimer() {
   /* this.getService().getTaskFromID(this.id).isRunning = false;
    clearInterval(this.getService().getTaskFromID(this.id).interval);*/
   this.getService().pauseTimer(this.id);
   clearInterval(this.interval);
   this._reload = false;
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
    if (this.getService().getTaskFromID(this.id).isRunning) {
      console.log('INIT' + this.id);
    }
    this.isRunning = this.getService().getTaskFromID(this.id).isRunning;
    this.interval = setInterval(() => {
      this._reload = true;
      this.reload();
      this.timerConvert();
    }, 1000);



    console.log('this TITLE: ' + this.TaskTitle);
    /*if (this.route !== null) {
      const urlID = this.route.snapshot.params.id;
      if (!isNaN(urlID)) {
        const tmp: ModelTask = this.getService().getTaskFromID(urlID);
        this.TaskTitle = tmp.TaskTitle;
        this.TaskTime = tmp.TaskTime;
        this.TaskSubTitle = tmp.TaskSubTitle;
        this.TaskSubID = tmp.TaskSubID;
        this.interval = tmp.interval;
        this.TaskRenderTimer = tmp.TaskRenderTimer;
        this.isRunning = tmp.isRunning;
        this.isQuick = tmp.isQuick;
      }
    }*/
  }


  onEnter(value: string) {
    this.taskService.editTaskName(this.id, value);
    this.editLogic();
  }

  getService() {
    return this.taskService;
  }

  delete() {
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
