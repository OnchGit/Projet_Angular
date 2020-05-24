import {Component, OnInit} from '@angular/core';
import {TaskService} from './Services/task.service';


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
    if (localStorage.getItem('ServiceData') === null || localStorage.getItem('ServiceData') === '' ) {
      this.getService().setup();
      console.log('setup');
    } else {
      this.getService().persistencyInit();
      console.log('Persistency');
      console.log(localStorage.getItem('ServiceData'));
    }

    setInterval(() => {
      this.getService().totalTimerHandler();
      this.getService().runningPersistency();
    }, 1000);
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










