import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUnassignConfirmComponent } from './contact-unassign-confirm-component';

describe('ContactUnassignConfirmComponent', () => {
  let component: ContactUnassignConfirmComponent;
  let fixture: ComponentFixture<ContactUnassignConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactUnassignConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactUnassignConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
