import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperOrganisationContactService } from './wrapper-org-contact-service';

describe('WrapperOrganisationContactService', () => {
  let component: WrapperOrganisationContactService;
  let fixture: ComponentFixture<WrapperOrganisationContactService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrapperOrganisationContactService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperOrganisationContactService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
