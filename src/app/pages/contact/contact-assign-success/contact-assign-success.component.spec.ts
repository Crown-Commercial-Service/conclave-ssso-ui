import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAssignSuccessComponent } from './contact-assign-success-component';

describe('ContactAssignSuccessComponent', () => {
  let component: ContactAssignSuccessComponent;
  let fixture: ComponentFixture<ContactAssignSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactAssignSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAssignSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
