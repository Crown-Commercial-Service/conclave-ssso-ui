import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { VerifyUserStatusComponent } from './verify-user-status.component';

describe('VerifyUserStatusComponent', () => {
  let component: VerifyUserStatusComponent;
  let fixture: ComponentFixture<VerifyUserStatusComponent>;

  beforeEach(() => {
    const titleStub = () => ({ setTitle: (arg: any) => ({}) });
    const activatedRouteStub = () => ({
      queryParams: { subscribe: (f: any) => f({}) }
    });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [VerifyUserStatusComponent],
      providers: [
        { provide: Title, useFactory: titleStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub }
      ]
    });
    fixture = TestBed.createComponent(VerifyUserStatusComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`isOrgAdmin has default value`, () => {
    expect(component.isOrgAdmin).toEqual(false);
  });

  it(`userStatus has default value`, () => {
    expect(component.userStatus).toEqual(0);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const titleStub: Title = fixture.debugElement.injector.get(Title);
      const spy1 = jest.spyOn(titleStub, 'setTitle');
      component.ngOnInit();
      expect(spy1).toHaveBeenCalled();
    });
  });
});
