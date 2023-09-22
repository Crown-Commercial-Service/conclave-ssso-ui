import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactHelper } from './contact-helper.service';

describe('ContactHelper', () => {
  let component: ContactHelper;
  let fixture: ComponentFixture<ContactHelper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactHelper ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactHelper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
