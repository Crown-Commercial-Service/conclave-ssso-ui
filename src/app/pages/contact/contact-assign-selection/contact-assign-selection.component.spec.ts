import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAssignSelectionComponent } from './contact-assign-selection-component';

describe('ContactAssignSelectionComponent', () => {
  let component: ContactAssignSelectionComponent;
  let fixture: ComponentFixture<ContactAssignSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactAssignSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAssignSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
