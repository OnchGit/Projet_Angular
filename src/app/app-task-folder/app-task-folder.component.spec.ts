import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTaskFolderComponent } from './app-task-folder.component';

describe('AppTaskFolderComponent', () => {
  let component: AppTaskFolderComponent;
  let fixture: ComponentFixture<AppTaskFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppTaskFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTaskFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
