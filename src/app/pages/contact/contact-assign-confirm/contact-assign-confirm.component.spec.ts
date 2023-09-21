import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAssignConfirmComponent } from './contact-assign-confirm-component';

describe('ContactAssignConfirmComponent', () => {
  let component: ContactAssignConfirmComponent;
  let fixture: ComponentFixture<ContactAssignConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactAssignConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAssignConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
