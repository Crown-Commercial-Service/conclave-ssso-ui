import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAssignErrorComponent } from './contact-assign-error-component';

describe('ContactAssignErrorComponent', () => {
  let component: ContactAssignErrorComponent;
  let fixture: ComponentFixture<ContactAssignErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactAssignErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAssignErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
