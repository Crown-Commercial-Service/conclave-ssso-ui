import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperOrganisationSiteService } from './wrapper-org-site-service';

describe('WrapperOrganisationSiteService', () => {
  let component: WrapperOrganisationSiteService;
  let fixture: ComponentFixture<WrapperOrganisationSiteService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrapperOrganisationSiteService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperOrganisationSiteService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
