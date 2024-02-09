import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RoleRequestSuccessComponent } from './role-request-success.component';
import { TranslateModule } from '@ngx-translate/core';

describe('RoleRequestSuccessComponent', () => {
  let component: RoleRequestSuccessComponent;
  let fixture: ComponentFixture<RoleRequestSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [RoleRequestSuccessComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: {
              subscribe: (callback: (params: any) => void) => {
                callback({
                  data: btoa(
                    JSON.stringify({
                      userName: 'admin',
                    })
                  ),
                });
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleRequestSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should parse user info from query params', () => {
    expect(component.userInfo).toEqual({ userName: 'admin' });
  });

  it('should set isOrgAdmin based on local storage', () => {
    localStorage.setItem('isOrgAdmin', 'true');
    component.ngOnInit();
    expect(component.isOrgAdmin).toBeTrue();
  });

  it('should navigate back on goBack()', () => {
    const spy = spyOn(window.history, 'back');
    component.goBack();
    expect(spy).toHaveBeenCalled();
  });
});
