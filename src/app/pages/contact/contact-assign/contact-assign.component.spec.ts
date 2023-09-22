import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAssignComponent } from './contact-assign-component';

describe('ContactAssignComponent', () => {
  let component: ContactAssignComponent;
  let fixture: ComponentFixture<ContactAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactAssignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
