// Task 7271: Code Climate - Complex Logical Expression
// Not in use will be removed in some time

// import {
//   Component,
//   ElementRef,
//   OnInit,
//   ViewChild,
//   ViewEncapsulation,
// } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { Store } from '@ngrx/store';
// import { ActivatedRoute, Router } from '@angular/router';

// import { BaseComponent } from 'src/app/components/base/base.component';
// import { slideAnimation } from 'src/app/animations/slide.animation';
// import { UIState } from 'src/app/store/ui.states';
// import { OrganisationService } from 'src/app/services/postgres/organisation.service';
// import { Observable } from 'rxjs';
// import { share } from 'rxjs/operators';
// import { Role } from 'src/app/models/organisationGroup';
// import { WrapperOrganisationGroupService } from 'src/app/services/wrapper/wrapper-org--group-service';
// import { WrapperConfigurationService } from 'src/app/services/wrapper/wrapper-configuration.service';
// import { ScrollHelper } from 'src/app/services/helper/scroll-helper.services';
// import { ViewportScroller } from '@angular/common';
// import { DataLayerService } from 'src/app/shared/data-layer.service';

// @Component({
//   selector: 'app-buyer-confirm',
//   templateUrl: './confirm.component.html',
//   styleUrls: ['./confirm.component.scss'],
//   animations: [
//     slideAnimation({
//       close: { transform: 'translateX(12.5rem)' },
//       open: { left: '-12.5rem' },
//     }),
//   ],
//   encapsulation: ViewEncapsulation.None,
// })
// export class BuyerConfirmComponent extends BaseComponent implements OnInit {
//   public organisation: any;
//   public org$!: Observable<any>;
//   public verified: boolean = false;
//   private id!: string;
//   userProfileForm: FormGroup;
//   orgRoles: Role[];
//   roles: Role[];
//   public orgEligableRoles$!: Observable<Role[]>;
//   public orgRoles$!: Observable<Role[]>;
//   eRoles: Role[];
//   rolesToAdd: Role[];
//   rolesToDelete: Role[];

//   @ViewChild('isBuyerTrue') isBuyerTrue!: ElementRef;
//   @ViewChild('isBuyerFalse') isBuyerFalse!: ElementRef;

//   constructor(
//     private formBuilder: FormBuilder,
//     private organisationService: OrganisationService,
//     private wrapperConfigService: WrapperConfigurationService,
//     public router: Router,
//     private route: ActivatedRoute,
//     protected uiStore: Store<UIState>,
//     private organisationGroupService: WrapperOrganisationGroupService,
//     protected viewportScroller: ViewportScroller,
//     protected scrollHelper: ScrollHelper,
//     private dataLayerService: DataLayerService
//   ) {
//     super(uiStore, viewportScroller, scrollHelper);
//     this.orgRoles = [];
//     this.eRoles = [];
//     this.roles = [];
//     this.userProfileForm = this.formBuilder.group({
//       userTitle: ['', null],
//     });
//     this.rolesToAdd = [];
//     this.rolesToDelete = [];
//   }

//   ngOnInit() {
//     this.route.params.subscribe((params) => {
//       if (params.id) {
//         this.id = params.id;
//         this.org$ = this.organisationService.getById(params.id).pipe(share());
//         this.org$.subscribe({
//           next: (data) => {
//             this.organisation = data;
//             this.verified = data.rightToBuy;
//             this.getOrgRoles();
//           },
//         });
//       }
//     });
//     this.dataLayerService.pushPageViewEvent({id: this.id});
//   }

//   public onSelect(verified: boolean) {
//     this.verified = verified;
//     this.rolesToAdd = [];
//     this.rolesToDelete = [];

//     if (verified) {
//       this.isBuyerTrue.nativeElement.checked = true;
//       this.isBuyerFalse.nativeElement.checked = false;
//     } else {
//       this.isBuyerTrue.nativeElement.checked = false;
//       this.isBuyerFalse.nativeElement.checked = true;
//     }

//     if (verified && !this.organisation.rightToBuy) {
//       const currentRoles = this.roles.filter(
//         (x) =>
//           x.enabled &&
//           x.subscriptionTypeEligibility === 0 &&
//           x.tradeEligibility !== 0 &&
//           x.orgTypeEligibility !== 0
//       );
//       const previousRoles = this.roles.filter(
//         (x) =>
//           x.enabled &&
//           x.subscriptionTypeEligibility === 0 &&
//           x.tradeEligibility !== 1 &&
//           x.orgTypeEligibility !== 0
//       );
//       previousRoles.forEach((r) => {
//         const match = currentRoles.includes(r);
//         if (!match) {
//           this.rolesToDelete.push(r);
//         }
//       });
//       currentRoles.forEach((r) => {
//         const match = previousRoles.includes(r);
//         if (!match) {
//           this.rolesToAdd.push(r);
//         }
//       });
//       const currentRoles2 = this.roles.filter(
//         (x) =>
//           x.enabled &&
//           x.subscriptionTypeEligibility === 1 &&
//           x.tradeEligibility !== 0 &&
//           x.orgTypeEligibility !== 0
//       );
//       const previousRoles2 = this.roles.filter(
//         (x) =>
//           x.enabled &&
//           x.subscriptionTypeEligibility === 1 &&
//           x.tradeEligibility !== 1 &&
//           x.orgTypeEligibility !== 0
//       );
//       previousRoles2.forEach((r) => {
//         const match = currentRoles2.includes(r);
//         if (!match) {
//           this.rolesToDelete.push(r);
//         }
//       });
//       currentRoles2.forEach((r) => {
//         const match = previousRoles2.includes(r);
//         if (!match) {
//           this.rolesToAdd.push(r);
//         }
//       });
//       console.log('to insert:');
//       console.log(this.rolesToAdd);
//       console.log('to remove:');
//       console.log(this.rolesToDelete);
//     } else if (!verified && this.organisation.rightToBuy) {
//       const currentRoles = this.roles.filter(
//         (x) =>
//           x.enabled &&
//           x.subscriptionTypeEligibility === 0 &&
//           x.tradeEligibility !== 1 &&
//           x.orgTypeEligibility !== 0
//       );
//       const previousRoles = this.roles.filter(
//         (x) =>
//           x.enabled &&
//           x.subscriptionTypeEligibility === 0 &&
//           x.tradeEligibility !== 0 &&
//           x.orgTypeEligibility !== 0
//       );
//       currentRoles.forEach((r) => {
//         const match = previousRoles.includes(r);
//         if (!match) {
//           this.rolesToAdd.push(r);
//         }
//       });
//       previousRoles.forEach((r) => {
//         const match = currentRoles.includes(r);
//         if (!match) {
//           this.rolesToDelete.push(r);
//         }
//       });
//       const currentRoles2 = this.roles.filter(
//         (x) =>
//           x.enabled &&
//           x.subscriptionTypeEligibility === 1 &&
//           x.tradeEligibility !== 1 &&
//           x.orgTypeEligibility !== 0
//       );
//       const previousRoles2 = this.roles.filter(
//         (x) =>
//           x.enabled &&
//           x.subscriptionTypeEligibility === 1 &&
//           x.tradeEligibility !== 0 &&
//           x.orgTypeEligibility !== 0
//       );
//       currentRoles2.forEach((r) => {
//         const match = previousRoles2.includes(r);
//         if (!match) {
//           this.rolesToAdd.push(r);
//         }
//       });
//       previousRoles2.forEach((r) => {
//         const match = currentRoles2.includes(r);
//         if (!match) {
//           this.rolesToDelete.push(r);
//         }
//       });
//       console.log('to insert:');
//       console.log(this.rolesToAdd);
//       console.log('to remove:');
//       console.log(this.rolesToDelete);
//     }
//   }

//   onChange(event: any, defaultValue: any, role: any) {
//     if (defaultValue === true && !event.target.checked) {
//       this.rolesToDelete.push(role);
//     } else if (defaultValue == true && event.target.checked) {
//       const index = this.rolesToDelete.indexOf(role);
//       if (index > -1) {
//         this.rolesToDelete.splice(index, 1);
//       }
//     }
//     if (defaultValue === false && event.target.checked) {
//       this.rolesToAdd.push(role);
//     } else if (defaultValue == false && !event.target.checked) {
//       const index = this.rolesToAdd.indexOf(role);
//       if (index > -1) {
//         this.rolesToAdd.splice(index, 1);
//       }
//     }
//   }

//   pushDataLayerEvent(buttonText:string) {
//     this.dataLayerService.pushClickEvent(buttonText);
//   }

//   public onSubmitClick(buttonText:string) {
//     let selection = {
//       org: this.organisation,
//       toDelete: this.rolesToDelete,
//       toAdd: this.rolesToAdd,
//       rightToBuy: this.verified,
//       hasChanges:
//         this.organisation.rightToBuy === this.verified &&
//         this.rolesToAdd.length === 0 &&
//         this.rolesToDelete.length === 0
//           ? false
//           : true,
//     };
//     localStorage.setItem(
//       `mse_org_${this.organisation.ciiOrganisationId}`,
//       JSON.stringify(selection)
//     );
//     this.router.navigateByUrl(
//       `buyer/confirm-changes/${this.organisation.ciiOrganisationId}`
//     );
//     this.pushDataLayerEvent(buttonText);
//   }

//   public onCancelClick(buttonText:string) {
//     localStorage.removeItem(`mse_org_${this.organisation.ciiOrganisationId}`);
//     this.router.navigateByUrl('buyer-supplier/search');
//     this.pushDataLayerEvent(buttonText);
//   }

//   getOrgRoles() {
//     this.orgRoles$ = this.wrapperConfigService.getRoles().pipe(share());
//     this.orgRoles$.subscribe({
//       next: (orgRoles: Role[]) => {
//         this.roles = orgRoles;
//         this.orgEligableRoles$ = this.organisationGroupService
//           .getGroupOrganisationRoles(this.organisation.ciiOrganisationId)
//           .pipe(share());
//         this.orgEligableRoles$.subscribe({
//           next: (eRoles: Role[]) => {
//             this.roles.forEach((r) => {
//               r.enabled = eRoles.some(
//                 (x) =>
//                   x.roleName == r.roleName && x.serviceName == r.serviceName
//               );
//             });
//             this.eRoles = eRoles;
//             setTimeout(() => {}, 100);
//           },
//           error: (err: any) => {
//             console.log(err);
//           },
//         });
//       },
//       error: (err: any) => {
//         console.log(err);
//       },
//     });
//   }
// }
