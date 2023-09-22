import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgSupportDetailsComponent } from './details.component';

describe('OrgSupportDetailsComponent', () => {
  let component: OrgSupportDetailsComponent;
  let fixture: ComponentFixture<OrgSupportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgSupportDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgSupportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
