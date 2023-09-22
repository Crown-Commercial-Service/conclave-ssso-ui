import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperUserDelegatedService } from './wrapper-user-delegated.service';

describe('WrapperUserDelegatedService', () => {
  let component: WrapperUserDelegatedService;
  let fixture: ComponentFixture<WrapperUserDelegatedService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrapperUserDelegatedService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperUserDelegatedService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
