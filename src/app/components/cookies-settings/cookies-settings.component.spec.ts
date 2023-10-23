// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { Router } from '@angular/router';
// import { CookiesService } from 'src/app/shared/cookies.service';
// import { FormsModule } from '@angular/forms';
// import { RouterTestingModule } from '@angular/router/testing';
// import { CookiesSettingsComponent } from './cookies-settings.component';
// import { environment } from 'src/environments/environment';

// describe('CookiesSettingsComponent', () => {
//   let component: CookiesSettingsComponent;
//   let fixture: ComponentFixture<CookiesSettingsComponent>;

//   beforeEach(() => {
//     const routerStub = () => ({});
//     const cookiesServiceStub = () => ({
//       setCookie: (
//         string: any,
//         cookies_prefernace: any,
//         cookieExpirationTimeInMinutes: any
//       ) => ({}),
//       deleteAdditionalCookies: () => ({}),
//       deleteGlassBoxCookies: () => ({})
//     });
//     TestBed.configureTestingModule({
//       imports: [FormsModule, RouterTestingModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       declarations: [CookiesSettingsComponent],
//       providers: [
//         { provide: Router, useFactory: routerStub },
//         { provide: CookiesService, useFactory: cookiesServiceStub }
//       ]
//     });
//     fixture = TestBed.createComponent(CookiesSettingsComponent);
//     component = fixture.componentInstance;
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it(`cookiesUpdated has default value`, () => {
//     expect(component.cookiesUpdated).toEqual(false);
//   });

//   it(`notify_admin_session has default value`, () => {
//     expect(component.notify_admin_session).toEqual(
//       environment.cookies_policy.essentialcookies.notify_admin_session
//     );
//   });

//   it(`cookie_policy has default value`, () => {
//     expect(component.cookie_policy).toEqual(
//       environment.cookies_policy.essentialcookies.cookie_policy
//     );
//   });

//   it(`ccs_sso_visitedsites has default value`, () => {
//     expect(component.ccs_sso_visitedsites).toEqual(
//       environment.cookies_policy.essentialcookies.ccs_sso_visitedsites
//     );
//   });

//   it(`opbs has default value`, () => {
//     expect(component.opbs).toEqual(
//       environment.cookies_policy.essentialcookies.opbs
//     );
//   });

//   it(`ccs_sso has default value`, () => {
//     expect(component.ccs_sso).toEqual(
//       environment.cookies_policy.essentialcookies.ccs_sso
//     );
//   });

//   it(`conclave has default value`, () => {
//     expect(component.conclave).toEqual(
//       environment.cookies_policy.essentialcookies.conclave
//     );
//   });

//   it(`XSRF_TOKEN has default value`, () => {
//     expect(component.XSRF_TOKEN).toEqual(
//       environment.cookies_policy.essentialcookies.XSRF_TOKEN
//     );
//   });

//   it(`XSRF_TOKEN_SVR has default value`, () => {
//     expect(component.XSRF_TOKEN_SVR).toEqual(
//       environment.cookies_policy.essentialcookies.XSRF_TOKEN_SVR
//     );
//   });

//   it(`AspNetCore_Antiforgery_GWNWkbbyKbw has default value`, () => {
//     expect(component.AspNetCore_Antiforgery_GWNWkbbyKbw).toEqual(
//       environment.cookies_policy.essentialcookies
//         .AspNetCore_Antiforgery_GWNWkbbyKbw
//     );
//   });

//   it(`auth0_compat has default value`, () => {
//     expect(component.auth0_compat).toEqual(
//       environment.cookies_policy.Auth0cookies.auth0_compat
//     );
//   });

//   it(`did_compat has default value`, () => {
//     expect(component.did_compat).toEqual(
//       environment.cookies_policy.Auth0cookies.did_compat
//     );
//   });

//   it(`did has default value`, () => {
//     expect(component.did).toEqual(environment.cookies_policy.Auth0cookies.did);
//   });

//   it(`auth0 has default value`, () => {
//     expect(component.auth0).toEqual(
//       environment.cookies_policy.Auth0cookies.auth0
//     );
//   });

//   it(`_cf_bm has default value`, () => {
//     expect(component._cf_bm).toEqual(
//       environment.cookies_policy.Auth0cookies.__cf_bm
//     );
//   });

//   it(`isOrgAdmin has default value`, () => {
//     expect(component.isOrgAdmin).toEqual(false);
//   });
// });
