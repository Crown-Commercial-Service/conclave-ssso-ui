import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperContactService } from './wrapper-contact.service';

describe('WrapperContactService', () => {
  let component: WrapperContactService;
  let fixture: ComponentFixture<WrapperContactService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrapperContactService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperContactService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
