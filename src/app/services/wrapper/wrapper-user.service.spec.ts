import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperUserService } from './wrapper-user.service';

describe('WrapperUserService', () => {
  let component: WrapperUserService;
  let fixture: ComponentFixture<WrapperUserService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrapperUserService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperUserService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
