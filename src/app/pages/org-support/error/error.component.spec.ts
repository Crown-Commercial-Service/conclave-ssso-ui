import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgSupportErrorComponent } from './error.component';

describe('OrgSupportErrorComponent', () => {
  let component: OrgSupportErrorComponent;
  let fixture: ComponentFixture<OrgSupportErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgSupportErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgSupportErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
