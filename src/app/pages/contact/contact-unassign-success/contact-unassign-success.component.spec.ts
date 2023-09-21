import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUnassignSuccessComponent } from './contact-unassign-success-component';

describe('ContactUnassignSuccessComponent', () => {
  let component: ContactUnassignSuccessComponent;
  let fixture: ComponentFixture<ContactUnassignSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactUnassignSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactUnassignSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
