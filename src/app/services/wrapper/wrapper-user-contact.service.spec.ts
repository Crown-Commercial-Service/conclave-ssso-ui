import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperUserContactService } from './wrapper-user-contact.service';

describe('WrapperUserContactService', () => {
  let component: WrapperUserContactService;
  let fixture: ComponentFixture<WrapperUserContactService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrapperUserContactService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperUserContactService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
