import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOrgServiceComponent } from './update-org-service.component';

describe('UpdateOrgServiceComponent', () => {
  let component: UpdateOrgServiceComponent;
  let fixture: ComponentFixture<UpdateOrgServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateOrgServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateOrgServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
