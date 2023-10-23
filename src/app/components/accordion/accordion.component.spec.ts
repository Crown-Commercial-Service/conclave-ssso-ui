// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { Router } from '@angular/router';
// import { ActivatedRoute } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { AccordionComponent } from './accordion.component';

// const data = [
//   { headerTextKeys: 'test', groupId: '1', serviceRoleGroups: [{ name: 'test', approvalStatus: 0 }] },
//   { headerTextKeys: 'test', groupId: '2', serviceRoleGroups: [{ name: 'test', approvalStatus: 0 }] },
//   { headerTextKeys: 'test', groupId: '3', serviceRoleGroups: [{ name: 'test', approvalStatus: 0 }] },
//   { headerTextKeys: 'test', groupId: '4', serviceRoleGroups: [{ name: 'test', approvalStatus: 0 }] },
// ];

// describe('AccordionComponent', () => {
//   let component: AccordionComponent;
//   let fixture: ComponentFixture<AccordionComponent>;
//   beforeEach(() => {
//     const routerStub = () => ({ url: {} });
//     const activatedRouteStub = () => ({
//       snapshot: { queryParams: { data: {} } }
//     });
//     TestBed.configureTestingModule({
//       imports: [FormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       declarations: [AccordionComponent],
//       providers: [
//         { provide: Router, useFactory: routerStub },
//         { provide: ActivatedRoute, useFactory: activatedRouteStub }
//       ]
//     });
//     fixture = TestBed.createComponent(AccordionComponent);
//     component = fixture.componentInstance;
//     component.groupShow = true;
//     component.data = data;
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it(`isEdit has default value`, () => {
//     expect(component.isEdit).toEqual(false);
//   });

//   it('should change the goup show to true/false', () => {
//     component.groupShow = false;
//     component.onTopToggle();
//     expect(component.groupShow).toBeTruthy();
//   });

//   it('should change the display style to none/block on Bottom Toggle', () => {
//     component.groupShow = false;
//     const id = 1;
//     component.onBottomToggle(id.toString());
//     const anchor = fixture.debugElement.nativeElement.querySelector(id);
//     console.log(fixture.debugElement.nativeElement);
//   });

//   it('should return element status', () => {
//     component.groupShow = false;
//     const id = 1;
//     component.getElementStatus(id.toString());
//     const anchor = fixture.debugElement.nativeElement.querySelector('#' + id);
//     console.log(anchor);

//   });

//   it('should emit data on checkbox click', () => {
//     component.groupShow = false;
//     const id = 1;
//     const valueToCheck = false;
//     component.onCheckBoxClick(data, valueToCheck);
//     const anchor = fixture.debugElement.nativeElement.querySelector('#' + id);
//     console.log(anchor);
//   });

//   it('should toggle role for user', () => {
//     component.groupShow = false;
//     const id = 1;
//     const valueToCheck = false;
//     component.toggleRoleForUser(id.toString());
//     const anchor = fixture.debugElement.nativeElement.querySelector('#' + id);
//     console.log(anchor);
//   });

//   it('should goto edit group', () => {
//     component.groupShow = false;
//     const id = 1;
//     const valueToCheck = false;
//     component.goToEditGroup(id.toString());
//     const anchor = fixture.debugElement.nativeElement.querySelector('#' + id);
//     console.log(anchor);
//   });

// });
