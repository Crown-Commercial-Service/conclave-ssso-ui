import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserContactDeleteConfirmComponent} from './user-contact-delete-confirm-component';

describe('UserContactDeleteConfirmComponent', () => {
  let component: UserContactDeleteConfirmComponent;
  let fixture: ComponentFixture<UserContactDeleteConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserContactDeleteConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserContactDeleteConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
