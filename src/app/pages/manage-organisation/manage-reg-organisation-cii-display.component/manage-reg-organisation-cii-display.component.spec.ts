import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOrgRegCIIOrgDisplayComponent} from './manage-reg-organisation-cii-display.component';

describe('ManageOrgRegCIIOrgDisplayComponent', () => {
  let component: ManageOrgRegCIIOrgDisplayComponent;
  let fixture: ComponentFixture<ManageOrgRegCIIOrgDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOrgRegCIIOrgDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrgRegCIIOrgDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
