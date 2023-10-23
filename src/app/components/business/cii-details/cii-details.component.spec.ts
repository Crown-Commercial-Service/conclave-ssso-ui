// import { ComponentFixture, TestBed } from "@angular/core/testing";
// import { CIIOrgDetails } from "./cii-details.component";
// import { NO_ERRORS_SCHEMA } from "@angular/core";
// import { ciiService } from "src/app/services/cii/cii.service";
// import { ActivatedRoute, Router } from "@angular/router";
// import { Store } from "@ngrx/store";
// import { ViewportScroller } from "@angular/common";
// import { ScrollHelper } from "src/app/services/helper/scroll-helper.services";

// describe("CIIOrgDetails", () => {
//     let component: CIIOrgDetails;
//     let fixture: ComponentFixture<CIIOrgDetails>;

//     beforeEach(() => {
//         const storeStub = () => ({ pipe: () => ({}), dispatch: () => ({}) });
//         const ciiServiceStub = () => ({ getIdentifierDetails: () => ({}) });
//         const routerStub = () => ({
//             events: {
//                 pipe: () => ({ subscribe: () => { } }),
//                 subscribe: () => { }
//             },
//             navigate: (array: Array<any>, object: any) => ({})
//         });
//         const activatedRouteStub = () => ({
//             firstChild: { firstChild: {}, snapshot: { data: {} } }
//         });
//         const viewportScrollerStub = () => ({ setOffset: ()=>({})});
//         const scrollHelperStub = () => ({});

//         TestBed.configureTestingModule({
//             declarations: [CIIOrgDetails],
//             schemas: [NO_ERRORS_SCHEMA],
//             providers: [
//                 { provide: Store, useFactory: storeStub },
//                 { provide: ciiService, useFactory: ciiServiceStub },
//                 { provide: Router, useFactory: routerStub },
//                 { provide: ActivatedRoute, useFactory: activatedRouteStub },
//                 { provide: ViewportScroller, useFactory: viewportScrollerStub },
//                 { provide: ScrollHelper, useFactory: scrollHelperStub },
//             ]
//         });

//         fixture = TestBed.createComponent(CIIOrgDetails);
//         component = fixture.componentInstance;
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });
// });