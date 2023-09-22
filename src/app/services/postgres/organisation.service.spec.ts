import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationService } from './organisation.service';

describe('OrganisationService', () => {
  let component: OrganisationService;
  let fixture: ComponentFixture<OrganisationService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
