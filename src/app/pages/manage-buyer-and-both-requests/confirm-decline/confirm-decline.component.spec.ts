import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeclineComponent } from './confirm-decline.component';

describe('ConfirmDeclineComponent', () => {
  let component: ConfirmDeclineComponent;
  let fixture: ComponentFixture<ConfirmDeclineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDeclineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeclineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
