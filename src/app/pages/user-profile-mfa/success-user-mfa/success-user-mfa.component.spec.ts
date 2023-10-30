import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { SuccessUserMfaComponent } from './success-user-mfa.component';
import { TranslateModule } from '@ngx-translate/core';

describe('SuccessUserMfaComponent', () => {
  let component: SuccessUserMfaComponent;
  let fixture: ComponentFixture<SuccessUserMfaComponent>;
  let mockActivatedRoute: any;
  let localStore: any = {
    isOrgAdmin: 'true',
  };

  beforeEach(async () => {
    spyOn(localStorage, 'getItem').and.callFake((key) =>
      key in localStore ? localStore[key] : null
    );

    mockActivatedRoute = {
      queryParams: {
        subscribe: (callback: (params: any) => void) => {
          callback({
            data: btoa(
              JSON.stringify({ IsUser: true, data: 'example@example.com' })
            ),
          });
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [SuccessUserMfaComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessUserMfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set isOrgAdmin to false by default', () => {
    expect(component.isOrgAdmin).toBeTrue();
  });

  it('should set decodedData correctly when data is provided in the query params', () => {
    expect(component.decodedData).toEqual({
      IsUser: true,
      data: 'example@example.com',
    });
  });

  it('should set sendError to false by default', () => {
    expect(component.sendError).toBeFalse();
  });
});
