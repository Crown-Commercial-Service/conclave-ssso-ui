import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerService } from './worker.service';

describe('WorkerService', () => {
  let component: WorkerService;
  let fixture: ComponentFixture<WorkerService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkerService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkerService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
