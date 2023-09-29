import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TopNavComponent } from './topnav.component';

describe('TopNavComponent', () => {
  let component: TopNavComponent;
  let fixture: ComponentFixture<TopNavComponent>;

  beforeEach(() => {
    const authServiceStub = () => ({
      isUserAuthenticated: () => ({}),
      logOutAndRedirect: () => ({})
    });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TopNavComponent],
      providers: [{ provide: AuthService, useFactory: authServiceStub }]
    });
    fixture = TestBed.createComponent(TopNavComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`isAuthenticated has default value`, () => {
    expect(component.isAuthenticated).toEqual(false);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      const spy1 = jest.spyOn(authServiceStub, 'isUserAuthenticated');
      component.ngOnInit();
      expect(spy1).toHaveBeenCalled();
    });
  });

  describe('signout', () => {
    it('makes expected calls', () => {
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      const spy1 = jest.spyOn(authServiceStub, 'logOutAndRedirect');
      component.signout();
      expect(spy1).toHaveBeenCalled();
    });
  });
});
