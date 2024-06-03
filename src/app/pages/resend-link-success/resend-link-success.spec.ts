import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ResendLinkSuccessComponent } from './resend-link-success';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('ResendLinkSuccessComponent', () => {
  let component: ResendLinkSuccessComponent;
  let fixture: ComponentFixture<ResendLinkSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ResendLinkSuccessComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                un: 'testUser',
              },
            },
          },
        },
        {
          provide: AuthService,
          useValue: {
            logOutAndRedirect: jasmine.createSpy('logOutAndRedirect'),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResendLinkSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the userName from query params', () => {
    expect(component.userName).toEqual('testUser');
  });

  it('should call logOutAndRedirect method when navigate link is clicked', () => {
    const authService = TestBed.inject(AuthService);
    const navigateLink =
      fixture.nativeElement.querySelector('.navigation-text');
    navigateLink.click();
    expect(authService.logOutAndRedirect).toHaveBeenCalled();
  });

  it('should render the correct text in the template', () => {
    const template = fixture.nativeElement;
    const content = template.querySelector('.content');
    const paragraph = content.querySelector('p');
    const navigateLink = content.querySelector('.navigation-text');

    expect(paragraph.textContent.trim()).toBe('RESEND_LINK_SUCCESStestUser');
    expect(navigateLink.textContent.trim()).toBe('RETURN_TO_LOGIN_PAGE');
  });
});
