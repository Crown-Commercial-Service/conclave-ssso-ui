import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgSupportSearchComponent } from './search.component';

describe('OrgSupportSearchComponent', () => {
  let component: OrgSupportSearchComponent;
  let fixture: ComponentFixture<OrgSupportSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgSupportSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgSupportSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
