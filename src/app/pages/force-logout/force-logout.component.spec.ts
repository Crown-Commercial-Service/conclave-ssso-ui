import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceLogoutComponent } from './force-logout.component';

describe('ForceLogoutComponent', () => {
  let component: ForceLogoutComponent;
  let fixture: ComponentFixture<ForceLogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForceLogoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
