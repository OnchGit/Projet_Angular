import {ModelTask} from '../Models/ModelTask';
import {ModelFolder} from '../Models/ModelFolder';



export class TaskService {
  taskList: Map<number, ModelTask> = new Map<number, ModelTask>();
  FolderList: Map<number, ModelFolder> = new Map<number, ModelFolder>();
  TaskID = 0;
  FolderID = 0;
  QuickStartCount = 1;
  isFirst = true;
  TotalRun = 0;
  LastRunDate: Date = new Date();

  public getTaskList() {
    return this.taskList;
  }

  public getFolderList() {
    return this.FolderList;
  }

  // get list of ids for the tasks in a specific folder
  public getTasksFromFolder(value: number) {
    const tmp: Array<number> = new Array<number>();
    this.taskList.forEach((elem: ModelTask, key: number ) => {
        if (elem.TaskSubID === value) {
          tmp.push(elem.id);
        }
    });
    return tmp;
  }

  // get list of ids for the tasks that are running
  public getRunningTasks() {
    const tmp: Array<number> = new Array<number>();
    this.taskList.forEach((elem: ModelTask, key: number) => {
      if (elem.isRunning && !elem.isQuick) {
       tmp.push(elem.id);
      }
    });
    return tmp;
  }

  public getAllRunningTasks() {
    const tmp: Array<number> = new Array<number>();
    this.taskList.forEach((elem: ModelTask, key: number) => {
      if (elem.isRunning) {
        tmp.push(elem.id);
      }
    });
    return tmp;
  }

  // get list of ids of the tasks that are a quick task
  public getQuickTasks() {
    const tmp: Array<number> = new Array<number>();
    this.taskList.forEach((elem: ModelTask, key: number) => {
      if (elem.isQuick) {
        tmp.push(elem.id);
      }
    });
    return tmp;
  }

  // handles attribution of unique Task ID
  public giveTaskID() {
    const tmp = this.TaskID;
    this.TaskID++;
    return tmp;
  }

  // handles attribution of unique Folder ID
  public giveFolderID() {
    const tmp = this.FolderID;
    this.FolderID++;
    return tmp;
  }

  // get task data from unique id
  public getTaskFromID(id: number) {
    const tmp: ModelTask = this.taskList.get(id);
    return tmp;
  }

  // get folder data from unique id
  public getFolderFromID(id: number) {
    return this.FolderList.get(id);
  }

  public getFolders() {
    const tmp = [];
    this.FolderList.forEach((elem: ModelFolder, key: number ) => {
        tmp.push(elem);
    });
    return tmp;
  }

  // deletes a Task
  public deleteTask(id: number) {
    clearInterval(this.taskList.get(id).interval);
    this.taskList.delete(id);
  }

  // deletes a Folder and it's associated Tasks
  public deleteFolder(id: number) {
    const taskDeletes = this.getTasksFromFolder(id);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < taskDeletes.length; i++) {
      this.taskList.delete(taskDeletes[i]);
    }
    this.FolderList.delete(id);
  }

  // edit folder name and apply the change to the tasks related to that folder
  public editFolderName(id: number, value: string) {
    this.FolderList.get(id).TaskFolderName = value;
    const folderTasks = this.getTasksFromFolder(id);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < folderTasks.length; i++) {
      this.taskList.get(folderTasks[i]).TaskSubTitle = value;
    }
  }

  // edit task name
  public editTaskName(id: number, value: string) {
    this.taskList.get(id).TaskTitle = value;
  }

  // create a Task value
  public createTask(value: string, FolderID?: number) {
    const tmp = new ModelTask();
    const tempId = this.giveTaskID();
    tmp.TaskTitle = value;
    tmp.TaskTime = 0;
    tmp.id = tempId;
    if (!isNaN(FolderID)) {
      tmp.TaskSubTitle = this.FolderList.get(FolderID).TaskFolderName;
      tmp.TaskSubID = FolderID;
      tmp.isQuick = false;
    } else {
      tmp.isQuick = true;
    }
    this.taskList.set(tempId, tmp);
  }

  // create a folder
  public createFolder(value: string) {
    const tmp = new ModelFolder();
    const tempId = this.giveFolderID();
    tmp.TaskFolderName = value;
    tmp.id = tempId;
    if (tmp.id === 0) {
      tmp.canEdit = false;
    } else{
      tmp.canEdit = true;
    }
    this.FolderList.set(tempId, tmp);

  }

  public createQuickTask() {
    const title = 'QuickTask ' + this.QuickStartCount;
    this.QuickStartCount++;
    this.createTask(title);

  }

  // get list of tasks models from list of id
  public getListTasksFromIDs(value: Array<number>) {
    const tmp = new Array<ModelTask>();
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0 ; i < value.length; i++) {
      tmp.push(this.taskList.get(value[i]));
    }
    return tmp;
  }

  // get total time of folder
  public getFolderTotalTime(id: number) {
    let total = 0;
    const tmp = this.getTasksFromFolder(id);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < tmp.length; i++) {
      const elem = this.getTaskFromID(tmp[i]);
      if (!isNaN(elem.TaskTime)) {
          total += elem.TaskTime;
      }
    }
    return total;
  }

  // convert seconds to time
  public convertSecondsToTime(value: number) {
    let tmp = 0;
    if (value != null && !isNaN(value)) {
      tmp = value;
      const DateObj  = new Date(tmp * 1000);
      const hours = DateObj.getUTCHours();
      const mins = DateObj.getUTCMinutes();
      const secs = DateObj.getSeconds();
      const TaskRenderTimer = hours + ':' + mins + ':' + secs;
      return TaskRenderTimer;
    } else {
      return 0 + ':' + 0 + ':' + 0;
    }
  }

  // handles logic of first iteration
  public setup() {
    if (this.isFirst) {
      this.createFolder('Single Tasks');
      this.isFirst = false;
    }
  }

  // handles changing parent folder of task
  public changeFolder(TaskID: number, FolderID: number) {
    const tmp =  this.getTaskFromID(TaskID);
    tmp.TaskSubID = FolderID;
    tmp.TaskSubTitle = this.getFolderFromID(FolderID).TaskFolderName;
    if (tmp.isQuick) {
      tmp.isQuick = false;
    }
  }

  // handles timer start
  public startTimer(id: number) {
    this.getTaskFromID(id).isRunning = true;
    this.getTaskFromID(id).interval = setInterval(() => {
      this.getTaskFromID(id).TaskTime++;
    }, 1000);
  }

  pauseTimer(id: number) {
    this.getTaskFromID(id).isRunning = false;
    clearInterval(this.getTaskFromID(id).interval);
  }

  // handles total timer
  public totalTimerHandler() {
    const tmp = this.getAllRunningTasks();
    if (tmp.length > 0 ) {
      this.TotalRun++;
    }
  }

  public persistencyInit() {
    const tmp = new Date(Date.now()).valueOf();
    if (localStorage.getItem('ServiceData') != null) {
      const tempService: TaskService = JSON.parse(localStorage.getItem('ServiceData'));
      this.TaskID = tempService.TaskID;
      this.FolderID = tempService.FolderID;
      this.QuickStartCount = tempService.QuickStartCount;
      this.isFirst = tempService.isFirst;
      this.TotalRun = tempService.TotalRun;
      this.LastRunDate = new Date(tempService.LastRunDate);
      this.getMapsFromLocal();
      const tmp2 = this.LastRunDate.valueOf();
      const addTime = (tmp - tmp2) / 1000;
      this.taskPersistency(addTime);
    }
  }

  public taskPersistency(seconds: number) {
    const tmp = this.getAllRunningTasks();
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < tmp.length; i++) {
      this.getTaskFromID(tmp[i]).TaskTime = this.getTaskFromID(tmp[i]).TaskTime + seconds;
      this.startTimer(tmp[i]);
    }
  }

  public runningPersistency() {
    this.LastRunDate = new Date(Date.now());
    localStorage.setItem('ServiceData', JSON.stringify(this));
    this.sendMapsToLocal();
  }

  public sendMapsToLocal() {
    const tmpTask: Array<ModelTask> = new Array<ModelTask>();
    this.taskList.forEach((elem: ModelTask, key: number ) => {
        tmpTask.push(elem);
      });

    const tmpFolder: Array<ModelFolder> = new Array<ModelFolder>();
    this.FolderList.forEach((elem: ModelFolder, key: number ) => {
      tmpFolder.push(elem);
    });

    localStorage.setItem('TaskList', JSON.stringify(tmpTask));
    localStorage.setItem('FolderList', JSON.stringify(tmpFolder));
  }


  public getMapsFromLocal() {

    const tmpTask: Array<ModelTask> = JSON.parse( localStorage.getItem('TaskList'));
    const tmpFolder: Array<ModelFolder> = JSON.parse( localStorage.getItem('FolderList'));
    const MapTask: Map<number, ModelTask> = new Map<number, ModelTask>();
    const MapFolder: Map<number, ModelFolder> = new Map<number, ModelFolder>();
    for (let i = 0 ; i < tmpTask.length; i++) {
      MapTask.set(tmpTask[i].id, tmpTask[i]);
    }

    for (let i = 0 ; i < tmpFolder.length; i++) {
      MapFolder.set(tmpFolder[i].id, tmpFolder[i]);
    }
    this.taskList = MapTask;
    this.FolderList = MapFolder;
  }





}
