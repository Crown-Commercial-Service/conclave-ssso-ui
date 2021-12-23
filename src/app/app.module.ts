import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import * as reducers from './store/ui.reducers';
import { HttpJwtAuthInterceptor } from './interceptors/http-jtw-auth.interceptor';
import { AuthService } from './services/auth/auth.service';
import { TokenService } from './services/auth/token.service';
import { ComponentsModule } from './components/index';
import { HomeComponent } from './pages/home/home.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { TokenComponent } from './pages/token/token.component';
import { AuthSuccessComponent } from './pages/auth-success/auth-success.component';
import { RegistrationSuccessComponent } from './pages/registration-success/registration-success.component';
import { ManageOrgRegStep1Component } from './pages/manage-organisation/manage-organisation-registration-step-1/manage-organisation-registration-step-1.component';
import { ManageOrgRegStep1BComponent } from './pages/manage-organisation/manage-organisation-registration-step-1b/manage-organisation-registration-step-1b.component';
import { ManageOrgRegStep2Component } from './pages/manage-organisation/manage-organisation-registration-step-2/manage-organisation-registration-step-2.component';
import { ManageOrgRegStep3Component } from './pages/manage-organisation/manage-organisation-registration-step-3/manage-organisation-registration-step-3.component';
import { ManageOrgRegAdditionalIdentifiersComponent } from './pages/manage-organisation/manage-organisation-registration-additional-identifiers/manage-organisation-registration-additional-identifiers.component';
import { ManageOrgRegAddUserComponent } from './pages/manage-organisation/manage-organisation-registration-add-user/manage-organisation-registration-add-user.component';
import { ManageOrgRegSuccessComponent } from './pages/manage-organisation/manage-organisation-registration-success/manage-organisation-registration-success.component';
import { ManageOrgRegErrorComponent } from './pages/manage-organisation/manage-organisation-registration-error/manage-organisation-registration-error.component';
import { ManageOrgRegErrorUsernameExistsComponent } from './pages/manage-organisation/manage-organisation-registration-error-username-already-exists/manage-organisation-registration-error-username-already-exists.component';
import { ManageOrgRegErrorNotFoundComponent } from './pages/manage-organisation/manage-organisation-registration-error-not-found/manage-organisation-registration-error-not-found.component';
import { ManageOrgRegFailureComponent } from './pages/manage-organisation/manage-organisation-registration-failure/manage-organisation-registration-failure.component';
import { ManageOrgRegConfirmComponent } from './pages/manage-organisation/manage-organisation-registration-confirm/manage-organisation-registration-confirm.component';
import { ManageOrgRegDetailsWrongComponent } from './pages/manage-organisation/manage-organisation-registration-error-details-wrong/manage-organisation-registration-error-details-wrong.component';
import { ManageOrgRegOrgNotFoundComponent } from './pages/manage-organisation/manage-organisation-registration-error-not-my-organisation/manage-organisation-registration-error-not-my-organisation.component';
import { ManageOrganisationContactEditComponent } from './pages/manage-organisation/manage-organisation-contact-edit/manage-organisation-contact-edit.component';
import { ManageOrganisationContactDeleteComponent } from './pages/manage-organisation/manage-organisation-contact-delete/manage-organisation-contact-delete.component';
import { ManageOrganisationContactOperationSuccessComponent } from './pages/manage-organisation/manage-organisation-contact-operation-success/manage-organisation-contact-operation-success.component';
import { ManageOrganisationProfileComponent } from './pages/manage-organisation/manage-organisation-profile/manage-organisation-profile.component';
import { UserProfileComponent } from './pages/user-profile/user-profile-component';
import { UserContactEditComponent } from './pages/user-contact/user-contact-edit/user-contact-edit.component';
import { OperationSuccessComponent } from './pages/operation-success/operation-success.component';
import { OperationFailedComponent } from './pages/operation-failed/operation-failed.component';
import { ManageOrganisationRegistrySearchComponent } from './pages/manage-organisation/manage-organisation-profile-registry-search/manage-organisation-profile-registry-search.component';
import { ManageOrganisationRegistryConfirmComponent } from './pages/manage-organisation/manage-organisation-profile-registry-confirm/manage-organisation-profile-registry-confirm.component';
import { ManageOrganisationRegistryDetailsWrongComponent } from './pages/manage-organisation/manage-organisation-profile-registry-error-details-wrong/manage-organisation-profile-registry-error-details-wrong.component';
import { ManageOrganisationRegistryOrgNotFoundComponent } from './pages/manage-organisation/manage-organisation-profile-registry-error-not-my-organisation/manage-organisation-profile-registry-error-not-my-organisation.component';
import { ManageOrganisationRegistryConfirmAdditionalDetailsComponent } from './pages/manage-organisation/manage-organisation-profile-registry-confirm-additional-identifiers/manage-organisation-profile-registry-confirm-additional-identifiers.component';
import { ManageOrganisationRegistryDeleteComponent } from './pages/manage-organisation/manage-organisation-profile-registry-delete/manage-organisation-profile-registry-delete.component';
import { ManageOrganisationRegistryDeleteConfirmationComponent } from './pages/manage-organisation/manage-organisation-profile-registry-delete-confirm/manage-organisation-profile-registry-delete-confirm.component';
import { ManageOrganisationRegistryAddConfirmationComponent } from './pages/manage-organisation/manage-organisation-profile-registry-add-confirmed/manage-organisation-profile-registry-add-confirmed.component';
import { GovUKTableComponent } from './components/govuk-table/govuk-table.component';
import { ManageOrganisationRegistryErrorComponent } from './pages/manage-organisation/manage-organisation-profile-registry-error/manage-organisation-profile-registry-error.component';
import { ErrorComponent } from './pages/error/error.component';
import { ManageUserProfilesComponent } from './pages/manage-user/manage-user-profiles/manage-user-profiles-component';
import { ManageUserAddSelectionComponent } from './pages/manage-user/manage-user-add-selection/manage-user-add-selection-component';
import { ManageUserAddSingleUserDetailComponent } from './pages/manage-user/manage-user-add-single-user-detail/manage-user-add-single-user-detail.component';
import { ManageUserConfirmResetPasswordComponent } from './pages/manage-user/manage-user-confirm-reset-password/manage-user-confirm-reset-password-component';
import { EnumToArrayPipe } from './pipes/enumToArrayPipe';
import { ManageOrganisationSiteEditComponent } from './pages/manage-organisation/manage-organisation-profile-site-edit/manage-organisation-profile-site-edit.component';
import { ManageOrganisationSiteDeleteComponent } from './pages/manage-organisation/manage-organisation-profile-site-delete/manage-organisation-profile-site-delete.component';
import { UserContactDeleteConfirmComponent } from './pages/user-contact/user-contact-delete-confirm/user-contact-delete-confirm-component';
import { NominateComponent } from './pages/nominate/nominate.component';
import { NominateSuccessComponent } from './pages/nominate-success/nominate-success.component';
import { ManageUserDeleteConfirmComponent } from './pages/manage-user/manage-user-delete-confirm/manage-user-delete-confirm-component';
import { ManageOrganisationErrorComponent } from './pages/manage-organisation/manage-organisation-error/manage-organisation-error.component';
import { ContactUsComponent } from './pages/contactus/contactus.component';
import { BuyerSearchComponent } from './pages/buyer/search/search.component';
import { BuyerConfirmComponent } from './pages/buyer/confirm/confirm.component';
import { BuyerDetailsComponent } from './pages/buyer/details/details.component';
import { BuyerSuccessComponent } from './pages/buyer/success/success.component';
import { OrgSupportSearchComponent } from './pages/org-support/search/search.component';
import { OrgSupportDetailsComponent } from './pages/org-support/details/details.component';
import { OrgSupportConfirmComponent } from './pages/org-support/confirm/confirm.component';
import { OrgSupportSuccessComponent } from './pages/org-support/success/success.component';
import { JwPaginationComponent } from 'src/app/components/pagination/pagination';
import { ManageGroupListComponent } from './pages/manage-group/manage-group-list/manage-group-list-component';
import { ManageGroupEditNameComponent } from './pages/manage-group/manage-group-edit-name/manage-group-edit-name-component';
import { ManageGroupEditUsersComponent } from './pages/manage-group/manage-group-edit-users/manage-group-edit-users-component';
import { ManageGroupEditUsersConfirmComponent } from './pages/manage-group/manage-group-edit-users-confirm/manage-group-edit-users-confirm-component';
import { ManageGroupEditRolesComponent } from './pages/manage-group/manage-group-edit-roles/manage-group-edit-roles-component';
import { ManageGroupEditRolesConfirmComponent } from './pages/manage-group/manage-group-edit-roles-confirm/manage-group-edit-roles-confirm-component';
import { ManageGroupViewComponent } from './pages/manage-group/manage-group-view/manage-group-view-component';
import { ManageGroupOperationSuccessComponent } from './pages/manage-group/manage-group-operation-success/manage-group-operation-success-component';
import { ManageGroupDeleteConfirmComponent } from './pages/manage-group/manage-group-delete-confirm/manage-group-delete-confirm-component';
import { ManageOrganisationProfileSuccessComponent } from './pages/manage-organisation/manage-organisation-profile-success/manage-organisation-profile-success.component';
import { LoadingIndicatorInterceptor } from './interceptors/loading-indicator.interceptor';
import { LoadingIndicatorService } from './services/helper/loading-indicator.service';
import { BuyerConfirmChangesComponent } from './pages/buyer/confirm-changes/confirm.component';
import { ManageOrgRegRightToBuyComponent } from './pages/manage-organisation/manage-organisation-registration-rightToBuy/manage-organisation-registration-type.component';
import { ManageOrgRegBuyerTypeComponent } from './pages/manage-organisation/manage-organisation-registration-buyer-type/manage-organisation-registration-buyer-type.component';
import { BuyerErrorComponent } from './pages/buyer/error/error.component';
import { OrgSupportErrorComponent } from './pages/org-support/error/error.component';
import { ForgotPasswordSuccessComponent } from './pages/forgot-password-success/forgot-password-success';
import { RollbarErrorHandler, rollbarFactory, RollbarService } from './logging/rollbar';
import { AuthErrorComponent } from './pages/auth-error/auth-error.component';
import { ContactAssignSelectionComponent } from './pages/contact/contact-assign-selection/contact-assign-selection-component';
import { ContactAssignUserSearchComponent } from './pages/contact/contact-assign-user-search/contact-assign-user-search-component';
import { ContactAssignSiteSearchComponent } from './pages/contact/contact-assign-site-search/contact-assign-site-searchcomponent';
import { ContactAssignComponent } from './pages/contact/contact-assign/contact-assign-component';
import { ContactAssignConfirmComponent } from './pages/contact/contact-assign-confirm/contact-assign-confirm-component';
import { ContactAssignSuccessComponent } from './pages/contact/contact-assign-success/contact-assign-success-component';
import { ContactUnassignConfirmComponent } from './pages/contact/contact-unassign-confirm/contact-unassign-confirm-component';
import { ContactUnassignSuccessComponent } from './pages/contact/contact-unassign-success/contact-unassign-success-component';
import { ContactAssignErrorComponent } from './pages/contact/contact-assign-error/contact-assign-error-component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { HelpAndSupportComponent } from './pages/help-support/help-support-component';
import { MFAResetComponent } from './pages/mfa-reset/mfa-reset-component';
import { MFAService } from './services/auth/mfa.service';
import { SendMFAResetNotificationComponent } from './pages/mfa-reset/send-notification/send-mfa-reset-notification';
import { ManageOrgRegErrorGenericComponent } from './pages/manage-organisation/manage-organisation-registration-error-generic/manage-organisation-registration-error-generic.component';
import { ErrorHandlerInterceptor } from './interceptors/error-handler.interceptor';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { SendMFAResetNotificationSuccessComponent } from './pages/mfa-reset/send-notification-success/send-mfa-reset-notification-success';
import { GoogleTagManagerModule } from 'angular-google-tag-manager';
import { environment } from 'src/environments/environment';
import { ResendLinkSuccessComponent } from './pages/resend-link-success/resend-link-success';
import { ManageOrgRegSearchComponent } from './pages/manage-organisation/manage-reg-organisation-search/manage-reg-organisation-search.component';
import { ManageOrgRegSearchStatusComponent } from './pages/manage-organisation/manage-reg-organisation-status/manage-reg-organisation-status.component';
import { ManageOrgRegNotRegisteredComponent } from './pages/manage-organisation/manage-reg-organisation-not-registered/manage-reg-organisation-not-registered.component';
import { CIIOptions } from './components/business/cii-options/cii-options.component';
import { CIIOrgDetails } from './components/business/cii-details/cii-details.component';
import { ManageOrgRegCIIOrgDisplayComponent } from './pages/manage-organisation/manage-reg-organisation-cii-display.component/manage-reg-organisation-cii-display.component';
import { OrgRegDetails } from './components/business/reg-org-details/reg-org-details.component';
import { ManageOrgRegNotifyAdminComponent } from './pages/manage-organisation/manage-reg-organisation-admin-notify/manage-reg-organisation-admin-notify.component';
import { ManageUserBulkUploadComponent } from './pages/manage-user/manage-user-bulk-upload/manage-user-bulk-upload.component';
import { ManageUserBulkUploadStatusComponent } from './pages/manage-user/manage-user-bulk-upload-status/manage-user-bulk-upload-status.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactUsComponent,
    OperationSuccessComponent,
    OperationFailedComponent,
    UserProfileComponent,
    UserContactEditComponent,
    UserContactDeleteConfirmComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    TokenComponent,
    AuthSuccessComponent,
    CIIOptions,
    CIIOrgDetails,
    OrgRegDetails,
    RegistrationSuccessComponent,
    ManageOrganisationProfileComponent,
    ManageOrganisationProfileSuccessComponent,
    NominateComponent,
    NominateSuccessComponent,
    ManageOrgRegStep1Component,
    ManageOrgRegStep1BComponent,
    ManageOrgRegStep2Component,
    ManageOrgRegStep3Component,
    ManageOrgRegAdditionalIdentifiersComponent,
    ManageOrgRegAddUserComponent,
    ManageOrgRegConfirmComponent,
    ManageOrgRegSuccessComponent,
    ManageOrgRegErrorComponent,
    ManageOrgRegErrorGenericComponent,
    ManageOrgRegErrorUsernameExistsComponent,
    ManageOrgRegErrorNotFoundComponent,
    ManageOrgRegFailureComponent,
    ManageOrgRegDetailsWrongComponent,
    ManageOrgRegOrgNotFoundComponent,
    ManageOrganisationContactEditComponent,
    ManageOrganisationContactDeleteComponent,
    ManageOrganisationContactOperationSuccessComponent,
    ManageOrganisationRegistrySearchComponent,
    ManageOrganisationRegistryConfirmComponent,
    ManageOrganisationRegistryConfirmAdditionalDetailsComponent,
    ManageOrganisationRegistryAddConfirmationComponent,
    ManageOrganisationRegistryDetailsWrongComponent,
    ManageOrganisationRegistryOrgNotFoundComponent,
    ManageOrganisationRegistryDeleteComponent,
    ManageOrganisationRegistryDeleteConfirmationComponent,
    ManageOrganisationRegistryErrorComponent,
    ErrorComponent,
    GovUKTableComponent,
    SearchBoxComponent,
    ManageUserProfilesComponent,
    ManageUserAddSelectionComponent,
    ManageUserAddSingleUserDetailComponent,
    ManageUserBulkUploadComponent,
    ManageUserBulkUploadStatusComponent,
    ManageUserConfirmResetPasswordComponent,
    ManageUserDeleteConfirmComponent,
    EnumToArrayPipe,
    ManageOrganisationSiteDeleteComponent,
    ManageOrganisationSiteEditComponent,
    ManageOrganisationErrorComponent,
    BuyerSearchComponent,
    BuyerDetailsComponent,
    BuyerConfirmComponent,
    BuyerSuccessComponent,
    OrgSupportSearchComponent,
    OrgSupportDetailsComponent,
    OrgSupportConfirmComponent,
    OrgSupportSuccessComponent,
    JwPaginationComponent,
    ManageGroupListComponent,
    ManageGroupEditNameComponent,
    ManageGroupEditUsersComponent,
    ManageGroupEditUsersConfirmComponent,
    ManageGroupEditRolesComponent,
    ManageGroupEditRolesConfirmComponent,
    ManageGroupViewComponent,
    ManageGroupOperationSuccessComponent,
    ManageGroupDeleteConfirmComponent,
    BuyerConfirmChangesComponent,
    ManageOrgRegRightToBuyComponent,
    ManageOrgRegBuyerTypeComponent,
    BuyerErrorComponent,
    OrgSupportErrorComponent,
    ForgotPasswordSuccessComponent,
    ResendLinkSuccessComponent,
    AuthErrorComponent,
    ContactAssignSelectionComponent,
    ContactAssignUserSearchComponent,
    ContactAssignSiteSearchComponent,
    ContactAssignComponent,
    ContactAssignConfirmComponent,
    ContactAssignSuccessComponent,
    ContactUnassignConfirmComponent,
    ContactUnassignSuccessComponent,
    ContactAssignErrorComponent,
    HelpAndSupportComponent,
    MFAResetComponent,
    SendMFAResetNotificationComponent,
    SendMFAResetNotificationSuccessComponent,
    ManageOrgRegSearchComponent,
    ManageOrgRegSearchStatusComponent,
    ManageOrgRegNotRegisteredComponent,
    ManageOrgRegCIIOrgDisplayComponent,
    ManageOrgRegNotifyAdminComponent
  ],
  imports: [
    // BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    StoreModule.forRoot({}),
    StoreModule.forFeature('ui-state', reducers.reducer),
    FlexLayoutModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatExpansionModule,
    NzButtonModule,
    NzDropDownModule,
    NzMenuModule,
    NzBreadCrumbModule,
    NzSliderModule,
    NzSwitchModule,
    NzLayoutModule,
    ComponentsModule,
    MatTableModule,
    NgxIntlTelInputModule
  ],
  exports: [TranslateModule],
  providers: [
    AuthService,
    MFAService,
    TokenService,
    // LoadingIndicatorService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpJwtAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingIndicatorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true },
    { provide: ErrorHandler, useClass: RollbarErrorHandler },
    { provide: RollbarService, useFactory: rollbarFactory },
    { provide: 'googleTagManagerId', useValue: environment.googleTagMangerId }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
