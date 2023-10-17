import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DelegatedUserListComponent } from './delegated-user-list.component';
import { WrapperUserDelegatedService } from 'src/app/services/wrapper/wrapper-user-delegated.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('DelegatedUserListComponent', () => {
  let component: DelegatedUserListComponent;
  let fixture: ComponentFixture<DelegatedUserListComponent>;
  let wrapperUserDelegatedService: WrapperUserDelegatedService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [DelegatedUserListComponent],
      providers: [WrapperUserDelegatedService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatedUserListComponent);
    component = fixture.componentInstance;
    wrapperUserDelegatedService = TestBed.inject(WrapperUserDelegatedService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.searchText).toEqual('');
    expect(component.searchSumbited).toBeFalse();
    expect(component.tabConfig.currentusers).toBeTrue();
    expect(component.tabConfig.expiredusers).toBeFalse();
    expect(component.organisationId).toEqual('');
    expect(component.currentUserstableConfig.currentPage).toEqual(1);
  });

  it('should navigate to delegated-remove-confirm page on onLinkClick with "Remove" action', () => {
    spyOn(component.router, 'navigateByUrl');
    const data = {
      event: {
        target: {
          innerText: 'Remove',
        },
        userName: 'testUser',
      },
    };
    component.onLinkClick(data);
    expect(component.router.navigateByUrl).toHaveBeenCalledWith(
      'delegated-remove-confirm?data=' + btoa(JSON.stringify(data))
    );
  });

  it('should navigate to delegate-access-user page on onLinkClick with "Edit" action', () => {
    spyOn(component.router, 'navigateByUrl');
    const data = {
      event: {
        target: {
          innerText: 'Edit',
        },
        userName: 'testUser',
      },
    };
    component.onLinkClick(data);
    expect(component.router.navigateByUrl).toHaveBeenCalledWith(
      'delegate-access-user?data=' + btoa(JSON.stringify(data))
    );
  });

  it('should unsubscribe from subscriptions on ngOnDestroy', () => {
    spyOn(sessionStorage, 'removeItem');
    component.ngOnDestroy();
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('activetab');
  });
});
