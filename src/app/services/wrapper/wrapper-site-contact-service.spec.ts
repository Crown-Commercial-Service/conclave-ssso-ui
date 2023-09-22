import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperSiteContactService } from './wrapper-site-contact-service';

describe('WrapperSiteContactService', () => {
  let component: WrapperSiteContactService;
  let fixture: ComponentFixture<WrapperSiteContactService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrapperSiteContactService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperSiteContactService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
