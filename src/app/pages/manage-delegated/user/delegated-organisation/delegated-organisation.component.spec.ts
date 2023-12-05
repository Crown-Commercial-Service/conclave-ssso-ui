import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegatedOrganisationComponent } from './delegated-organisation.component';

describe('DelegatedOrganisationComponent', () => {
  let component: DelegatedOrganisationComponent;
  let fixture: ComponentFixture<DelegatedOrganisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegatedOrganisationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedOrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
