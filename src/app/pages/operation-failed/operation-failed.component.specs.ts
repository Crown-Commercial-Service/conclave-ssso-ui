import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationFailedComponent } from './operation-failed.component';

describe('OperationFailedComponent', () => {
  let component: OperationFailedComponent;
  let fixture: ComponentFixture<OperationFailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationFailedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
