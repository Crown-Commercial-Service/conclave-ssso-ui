import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindDelegatedUserComponent } from './find-delegated-user.component';

describe('FindDelegatedUserComponent', () => {
  let component: FindDelegatedUserComponent;
  let fixture: ComponentFixture<FindDelegatedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindDelegatedUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindDelegatedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
