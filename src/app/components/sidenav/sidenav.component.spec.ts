import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SideNavComponent } from './sidenav.component';

describe('SideNavComponent', () => {
  let component: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;

  beforeEach(() => {
    const authServiceStub = () => ({
      logOutAndRedirect: () => ({}),
      isAuthenticated: () => ({})
    });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [SideNavComponent],
      providers: [{ provide: AuthService, useFactory: authServiceStub }]
    });
    fixture = TestBed.createComponent(SideNavComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`collapsed has default value`, () => {
    expect(component.collapsed).toEqual(true);
  });

  describe('logOut', () => {
    it('makes expected calls', () => {
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      const spy1 = jest.spyOn(authServiceStub, 'logOutAndRedirect');
      component.logOut();
      expect(spy1).toHaveBeenCalled();
    });
  });

  describe('isAuthenticated', () => {
    it('makes expected calls', () => {
      const authServiceStub: AuthService = fixture.debugElement.injector.get(
        AuthService
      );
      const spy1 = jest.spyOn(authServiceStub, 'isAuthenticated');
      component.isAuthenticated();
      expect(spy1).toHaveBeenCalled();
    });
  });
});
