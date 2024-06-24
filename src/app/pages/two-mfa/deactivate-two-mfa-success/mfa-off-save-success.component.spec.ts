import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { MfaOffSaveSuccessComponent } from './mfa-off-save-success.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
import { DataLayerService } from 'src/app/shared/data-layer.service';
import { SessionService } from 'src/app/shared/session.service';
import { UIState } from 'src/app/store/ui.states';
import { TranslateModule } from '@ngx-translate/core';

describe('MfaOffSaveSuccessComponent', () => {
    let component: MfaOffSaveSuccessComponent;
    let fixture: ComponentFixture<MfaOffSaveSuccessComponent>;
    let dataLayerService: jasmine.SpyObj<DataLayerService>;

    beforeEach(async () => {
        const dataLayerServiceSpy = jasmine.createSpyObj('DataLayerService', ['pushPageViewEvent']);
        const authServiceSpy = jasmine.createSpyObj('AuthService', ['']);
        const scrollHelperSpy = jasmine.createSpyObj('ScrollHelper', ['']);
        const sessionServiceSpy = jasmine.createSpyObj('SessionService', ['']);
        const routerSpy = { navigate: jasmine.createSpy('navigate') };
        const activatedRouteStub = { queryParams: of({}) };

        await TestBed.configureTestingModule({
            declarations: [MfaOffSaveSuccessComponent],
            imports: [TranslateModule.forRoot(),],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: SessionService, useValue: sessionServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: AuthService, useValue: authServiceSpy },
                { provide: Store, useValue: {} },
                { provide: ViewportScroller },
                { provide: ScrollHelper },
                { provide: DataLayerService, useValue: dataLayerServiceSpy },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(MfaOffSaveSuccessComponent);
        component = fixture.componentInstance;
        dataLayerService = TestBed.inject(DataLayerService) as jasmine.SpyObj<DataLayerService>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call pushPageViewEvent on ngOnInit', () => {
        component.ngOnInit();
        expect(dataLayerService.pushPageViewEvent).toHaveBeenCalled();
    });
});
