import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DormancyMessageComponent } from './dormancy-message.component';

describe('DormancyMessageComponent', () => {
  let component: DormancyMessageComponent;
  let fixture: ComponentFixture<DormancyMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DormancyMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DormancyMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
