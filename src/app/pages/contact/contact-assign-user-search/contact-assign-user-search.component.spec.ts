import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAssignUserSearchComponent } from './contact-assign-user-search-component';

describe('ContactAssignUserSearchComponent', () => {
  let component: ContactAssignUserSearchComponent;
  let fixture: ComponentFixture<ContactAssignUserSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactAssignUserSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAssignUserSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
