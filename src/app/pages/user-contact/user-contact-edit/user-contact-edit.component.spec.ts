import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserContactEditComponent} from './user-contact-edit.component';

describe('UserContactEditComponent', () => {
  let component: UserContactEditComponent;
  let fixture: ComponentFixture<UserContactEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserContactEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserContactEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
