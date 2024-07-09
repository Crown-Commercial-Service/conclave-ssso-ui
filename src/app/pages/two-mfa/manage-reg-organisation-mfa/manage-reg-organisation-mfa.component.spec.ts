import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import { ElementRef } from '@angular/core';
import { of } from 'rxjs';

import { ManageOrgRegMfaComponent } from './manage-reg-organisation-mfa.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';
import { DetailsToggleService } from 'src/app/shared/shared-details-toggle.service';
import { UIState } from 'src/app/store/ui.states';
import { TranslateModule } from '@ngx-translate/core';

describe('ManageOrgRegMfaComponent', () => {
    let component: ManageOrgRegMfaComponent;
    let fixture: ComponentFixture<ManageOrgRegMfaComponent>;
    let routerSpy = { navigateByUrl: jasmine.createSpy('navigateByUrl') };
    let activatedRouteStub = {
        snapshot: {
            queryParams: {
                data: JSON.stringify('sampleData')
            }
        }
    };
    let dataLayerServiceSpy = jasmine.createSpyObj('DataLayerService', ['pushPageViewEvent', 'pushEvent', 'pushClickEvent']);
    let detailsToggleServiceSpy = jasmine.createSpyObj('DetailsToggleService', ['addToggleListener', 'removeToggleListener']);
    let elementRefStub = {
        nativeElement: {
            querySelector: jasmine.createSpy('querySelector').and.returnValue({})
        }
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ManageOrgRegMfaComponent],
            imports: [TranslateModule.forRoot()],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: Router, useValue: routerSpy },
                { provide: AuthService, useValue: {} },
                { provide: SessionService, useValue: {} },
                { provide: DataLayerService, useValue: dataLayerServiceSpy },
                { provide: Store, useValue: {} },
                { provide: ViewportScroller },
                { provide: ScrollHelper },
                { provide: DetailsToggleService, useValue: detailsToggleServiceSpy },
                { provide: ElementRef, useValue: elementRefStub }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ManageOrgRegMfaComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call pushPageViewEvent on ngOnInit', () => {
        component.ngOnInit();
        expect(dataLayerServiceSpy.pushPageViewEvent).toHaveBeenCalled();
    });

    it('should add toggle listener on ngAfterViewInit', () => {
        component.ngAfterViewInit();
        expect(detailsToggleServiceSpy.addToggleListener).toHaveBeenCalled();
    });

    it('should remove toggle listener on ngOnDestroy', () => {
        component.ngOnDestroy();
        expect(detailsToggleServiceSpy.removeToggleListener).toHaveBeenCalled();
    });

    it('should navigate to register page on onContinueClick', () => {
        sessionStorage.setItem('orgreginfo', JSON.stringify({}));
        component.onContinueClick('required');
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('manage-org/register/type');
        expect(dataLayerServiceSpy.pushClickEvent).toHaveBeenCalledWith('Continue');
    });

    it('should set orgMfaSetting correctly in sessionStorage on onContinueClick', () => {
        const orgReginfo = { someProperty: 'someValue' };
        sessionStorage.setItem('orgreginfo', JSON.stringify(orgReginfo));

        component.onContinueClick('optional');
        const storedOrgReginfo = JSON.parse(sessionStorage.getItem('orgreginfo') || '{}');
        expect(storedOrgReginfo.isMfaRequired).toBeFalse();

        component.onContinueClick('required');
        const storedOrgReginfoRequired = JSON.parse(sessionStorage.getItem('orgreginfo') || '{}');
        expect(storedOrgReginfoRequired.isMfaRequired).toBeTrue();
    });
});
