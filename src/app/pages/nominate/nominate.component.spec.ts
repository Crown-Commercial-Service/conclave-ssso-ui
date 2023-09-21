import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NominateComponent } from './nominate.component';

describe('NominateComponent', () => {
  let component: NominateComponent;
  let fixture: ComponentFixture<NominateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NominateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NominateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
