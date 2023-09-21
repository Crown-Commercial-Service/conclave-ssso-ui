import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAssignSiteSearchComponent } from './contact-assign-site-searchcomponent';

describe('ContactAssignSiteSearchComponent', () => {
  let component: ContactAssignSiteSearchComponent;
  let fixture: ComponentFixture<ContactAssignSiteSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactAssignSiteSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAssignSiteSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
