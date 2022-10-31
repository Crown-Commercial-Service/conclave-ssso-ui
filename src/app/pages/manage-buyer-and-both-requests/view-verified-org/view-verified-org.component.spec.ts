import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVerifiedOrgComponent } from './view-verified-org.component';

describe('ViewVerifiedOrgComponent', () => {
  let component: ViewVerifiedOrgComponent;
  let fixture: ComponentFixture<ViewVerifiedOrgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewVerifiedOrgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVerifiedOrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
