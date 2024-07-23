import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { ManageOrgMfaUpdateSuccessComponent } from './manage-org-mfa-update-success.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { WrapperUserService } from 'src/app/services/wrapper/wrapper-user.service';
import { UIState } from 'src/app/store/ui.states';
import { TranslateModule } from '@ngx-translate/core';

describe('ManageOrgMfaUpdateSuccessComponent', () => {
    let component: ManageOrgMfaUpdateSuccessComponent;
    let fixture: ComponentFixture<ManageOrgMfaUpdateSuccessComponent>;
    let routerSpy = { navigateByUrl: jasmine.createSpy('navigateByUrl') };
    let activatedRouteStub = {
        snapshot: {
            queryParams: {
                data: JSON.stringify('sampleData')
            }
        }
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ManageOrgMfaUpdateSuccessComponent],
            imports: [TranslateModule.forRoot()],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: Router, useValue: routerSpy },
                { provide: AuthService, useValue: {} },
                { provide: WrapperUserService, useValue: {} },
                { provide: Store, useValue: {} },
                { provide: ViewportScroller },
                { provide: ScrollHelper },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ManageOrgMfaUpdateSuccessComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set orgMfaSetting from queryParams on ngOnInit', () => {
        component.ngOnInit();
        expect(component.orgMfaSetting).toBe('sampleData');
    });

    it('should navigate to manage-org/profile on onNavigateToProfileClick', () => {
        component.onNavigateToProfileClick();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('manage-org/profile');
    });
});
