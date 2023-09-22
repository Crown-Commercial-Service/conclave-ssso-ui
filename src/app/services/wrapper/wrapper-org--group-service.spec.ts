import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperOrganisationGroupService } from './wrapper-org--group-service';

describe('WrapperOrganisationGroupService', () => {
  let component: WrapperOrganisationGroupService;
  let fixture: ComponentFixture<WrapperOrganisationGroupService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrapperOrganisationGroupService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperOrganisationGroupService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
