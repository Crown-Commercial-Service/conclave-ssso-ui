// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { ViewportScroller } from '@angular/common';
// import { Store } from '@ngrx/store';
// import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
// import { ciiService } from 'src/app/services/cii/cii.service';
// import { OrgRegDetails } from './reg-org-details.component';

// describe('OrgRegDetails', () => {
//   let component: OrgRegDetails;
//   let fixture: ComponentFixture<OrgRegDetails>;

//   beforeEach(() => {
//     const viewportScrollerStub = () => ({});
//     const storeStub = () => ({});
//     const scrollHelperStub = () => ({});
//     const ciiServiceStub = () => ({
//       getIdentifierDetails: (scheme: any, ciiRegNumber: any) => ({}),
//       getOrgDetails: (ciiOrgId: any) => ({ toPromise: () => ({ then: () => ({}) }) }),
//       getSchemaName: (scheme: any) => ({})
//     });
//     TestBed.configureTestingModule({
//       schemas: [NO_ERRORS_SCHEMA],
//       declarations: [OrgRegDetails],
//       providers: [
//         { provide: ViewportScroller, useFactory: viewportScrollerStub },
//         { provide: Store, useFactory: storeStub },
//         { provide: ScrollHelper, useFactory: scrollHelperStub },
//         { provide: ciiService, useFactory: ciiServiceStub }
//       ]
//     });
//     fixture = TestBed.createComponent(OrgRegDetails);
//     component = fixture.componentInstance;
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it(`orgGroup has default value`, () => {
//     expect(component.orgGroup).toEqual(`manage-org/register/user`);
//   });
// });
