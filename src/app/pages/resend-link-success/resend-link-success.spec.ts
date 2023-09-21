import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendLinkSuccessComponent} from './resend-link-success';

describe('ResendLinkSuccessComponent', () => {
  let component: ResendLinkSuccessComponent;
  let fixture: ComponentFixture<ResendLinkSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResendLinkSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResendLinkSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
