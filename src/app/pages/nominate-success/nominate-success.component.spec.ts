import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NominateSuccessComponent } from './nominate-success.component';

describe('NominateSuccessComponent', () => {
  let component: NominateSuccessComponent;
  let fixture: ComponentFixture<NominateSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NominateSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NominateSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
