import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegatedUserListComponent } from './delegated-user-list.component';

describe('DelegatedUserListComponent', () => {
  let component: DelegatedUserListComponent;
  let fixture: ComponentFixture<DelegatedUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegatedUserListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
