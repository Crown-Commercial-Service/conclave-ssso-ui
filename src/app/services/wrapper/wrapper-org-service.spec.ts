import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperOrganisationService } from './wrapper-org-service';

describe('WrapperOrganisationService', () => {
  let component: WrapperOrganisationService;
  let fixture: ComponentFixture<WrapperOrganisationService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrapperOrganisationService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperOrganisationService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
