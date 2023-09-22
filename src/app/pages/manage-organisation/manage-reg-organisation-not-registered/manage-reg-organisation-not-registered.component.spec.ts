import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegNotRegisteredComponent} from './manage-reg-organisation-not-registered.component';

describe('ManageOrgRegNotRegisteredComponent', () => {
  let component: ManageOrgRegNotRegisteredComponent;
  let fixture: ComponentFixture<ManageOrgRegNotRegisteredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegNotRegisteredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegNotRegisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
