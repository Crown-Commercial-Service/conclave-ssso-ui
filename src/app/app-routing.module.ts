import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';

import { AuthGuard } from './services/auth/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { TokenComponent } from './pages/token/token.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { AuthSuccessComponent } from './pages/auth-success/auth-success.component';
import { RegistrationSuccessComponent } from './pages/registration-success/registration-success.component';
import { ManageOrgRegStep1Component } from './pages/manage-organisation/manage-organisation-registration-step-1/manage-organisation-registration-step-1.component';
import { ManageOrgRegStep2Component } from './pages/manage-organisation/manage-organisation-registration-step-2/manage-organisation-registration-step-2.component';
import { ManageOrgRegStep3Component } from './pages/manage-organisation/manage-organisation-registration-step-3/manage-organisation-registration-step-3.component';
import { ManageOrgRegAdditionalIdentifiersComponent } from './pages/manage-organisation/manage-organisation-registration-additional-identifiers/manage-organisation-registration-additional-identifiers.component';
import { ManageOrgRegAddUserComponent } from './pages/manage-organisation/manage-organisation-registration-add-user/manage-organisation-registration-add-user.component';
import { ManageOrgRegSuccessComponent } from './pages/manage-organisation/manage-organisation-registration-success/manage-organisation-registration-success.component';
import { ManageOrgRegFailureComponent } from './pages/manage-organisation/manage-organisation-registration-failure/manage-organisation-registration-failure.component';
import { ManageOrgRegErrorComponent } from './pages/manage-organisation/manage-organisation-registration-error/manage-organisation-registration-error.component';
import { ManageOrgRegErrorUsernameExistsComponent } from './pages/manage-organisation/manage-organisation-registration-error-username-already-exists/manage-organisation-registration-error-username-already-exists.component';
import { ManageOrgRegErrorNotFoundComponent } from './pages/manage-organisation/manage-organisation-registration-error-not-found/manage-organisation-registration-error-not-found.component';
import { ManageOrgRegConfirmComponent } from './pages/manage-organisation/manage-organisation-registration-confirm/manage-organisation-registration-confirm.component';
import { ManageOrgRegDetailsWrongComponent } from './pages/manage-organisation/manage-organisation-registration-error-details-wrong/manage-organisation-registration-error-details-wrong.component';
import { ManageOrgRegOrgNotFoundComponent } from './pages/manage-organisation/manage-organisation-registration-error-not-my-organisation/manage-organisation-registration-error-not-my-organisation.component';
import { ManageOrganisationProfileComponent } from './pages/manage-organisation/manage-organisation-profile/manage-organisation-profile.component';
import { ManageOrganisationContactEditComponent } from './pages/manage-organisation/manage-organisation-contact-edit/manage-organisation-contact-edit.component';
import { ManageOrganisationContactDeleteComponent } from './pages/manage-organisation/manage-organisation-contact-delete/manage-organisation-contact-delete.component';
import { ManageOrganisationContactOperationSuccessComponent } from './pages/manage-organisation/manage-organisation-contact-operation-success/manage-organisation-contact-operation-success.component';
import { UserProfileComponent } from './pages/user-profile/user-profile-component';
import { ManageOrgRegErrorGenericComponent } from './pages/manage-organisation/manage-organisation-registration-error-generic/manage-organisation-registration-error-generic.component';
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
import { ManageOrganisationRegistryErrorComponent } from './pages/manage-organisation/manage-organisation-profile-registry-error/manage-organisation-profile-registry-error.component';
import { ErrorComponent } from './pages/error/error.component';
import { ManageUserProfilesComponent } from './pages/manage-user/manage-user-profiles/manage-user-profiles-component';
import { ManageUserAddSelectionComponent } from './pages/manage-user/manage-user-add-selection/manage-user-add-selection-component';
import { ManageUserAddSingleUserDetailComponent } from './pages/manage-user/manage-user-add-single-user-detail/manage-user-add-single-user-detail.component';
import { ManageUserConfirmResetPasswordComponent } from './pages/manage-user/manage-user-confirm-reset-password/manage-user-confirm-reset-password-component';
import { ManageOrganisationSiteDeleteComponent } from './pages/manage-organisation/manage-organisation-profile-site-delete/manage-organisation-profile-site-delete.component';
import { ManageOrganisationSiteEditComponent } from './pages/manage-organisation/manage-organisation-profile-site-edit/manage-organisation-profile-site-edit.component';
import { UserContactDeleteConfirmComponent } from './pages/user-contact/user-contact-delete-confirm/user-contact-delete-confirm-component';
import { NominateComponent } from './pages/nominate/nominate.component';
import { ManageOrgRegStep1BComponent } from './pages/manage-organisation/manage-organisation-registration-step-1b/manage-organisation-registration-step-1b.component';
import { NominateSuccessComponent } from './pages/nominate-success/nominate-success.component';
import { ManageUserDeleteConfirmComponent } from './pages/manage-user/manage-user-delete-confirm/manage-user-delete-confirm-component';
import { ManageOrganisationErrorComponent } from './pages/manage-organisation/manage-organisation-error/manage-organisation-error.component';
import { ContactUsComponent } from './pages/contactus/contactus.component';
import { BuyerSearchComponent } from './pages/buyer/search/search.component';
// import { BuyerConfirmComponent } from './pages/buyer/confirm/confirm.component';
import { BuyerDetailsComponent } from './pages/buyer/details/details.component';
import { BuyerSuccessComponent } from './pages/buyer/success/success.component';
import { OrgSupportSuccessComponent } from './pages/org-support/success/success.component';
import { OrgSupportConfirmComponent } from './pages/org-support/confirm/confirm.component';
import { OrgSupportDetailsComponent } from './pages/org-support/details/details.component';
import { OrgSupportSearchComponent } from './pages/org-support/search/search.component';
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
import { BuyerConfirmChangesComponent } from './pages/buyer/confirm-changes/confirm.component';
import { ManageOrgRegRightToBuyComponent } from './pages/manage-organisation/manage-organisation-registration-rightToBuy/manage-organisation-registration-type.component';
import { ManageOrgRegBuyerTypeComponent } from './pages/manage-organisation/manage-organisation-registration-buyer-type/manage-organisation-registration-buyer-type.component';
import { RoleGuard } from './services/auth/role.guard';
import { BuyerErrorComponent } from './pages/buyer/error/error.component';
import { OrgSupportErrorComponent } from './pages/org-support/error/error.component';
import { ForgotPasswordSuccessComponent } from './pages/forgot-password-success/forgot-password-success';
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
import { ManageGroupErrorComponent } from './pages/manage-group/manage-group-error/manage-group-error.component';
import { HelpAndSupportComponent } from './pages/help-support/help-support-component';
import { MFAResetComponent } from './pages/mfa-reset/mfa-reset-component';
import { SendMFAResetNotificationComponent } from './pages/mfa-reset/send-notification/send-mfa-reset-notification';
import { SendMFAResetNotificationSuccessComponent } from './pages/mfa-reset/send-notification-success/send-mfa-reset-notification-success';
import { ResendLinkSuccessComponent } from './pages/resend-link-success/resend-link-success';
import { ManageOrgRegSearchComponent } from './pages/manage-organisation/manage-reg-organisation-search/manage-reg-organisation-search.component';
import { ManageOrgRegSearchStatusNewComponent } from './pages/manage-organisation/manage-reg-organisation-status-new/manage-reg-organisation-status-new.component';
import { ManageOrgRegNotRegisteredComponent } from './pages/manage-organisation/manage-reg-organisation-not-registered/manage-reg-organisation-not-registered.component';
import { ManageOrgRegCIIOrgDisplayComponent } from './pages/manage-organisation/manage-reg-organisation-cii-display.component/manage-reg-organisation-cii-display.component';
import { ManageOrgRegNotifyAdminComponent } from './pages/manage-organisation/manage-reg-organisation-admin-notify/manage-reg-organisation-admin-notify.component';
import { ManageUserBulkUploadComponent } from './pages/manage-user/manage-user-bulk-upload/manage-user-bulk-upload.component';
import { ManageUserBulkUploadStatusComponent } from './pages/manage-user/manage-user-bulk-upload-status/manage-user-bulk-upload-status.component';
import { LoginComponent } from './pages/login/mock-login/login.component';
import { ManageOrgRegSearchStatusExistsComponent } from './pages/manage-organisation/manage-reg-organisation-status-exists/manage-reg-organisation-status-exists.component';
import { ManageOrgRegSearchStatusDuplicateComponent } from './pages/manage-organisation/manage-reg-organisation-status-duplicate/manage-reg-organisation-status-duplicate.component';
import { ManageUserBulkUploadMigrationStatusComponent } from './pages/manage-user/manage-user-bulk-upload-migration-status/manage-user-bulk-upload-migration-status.component';
import { FindyouradministratorComponent } from './pages/manage-organisation/find-your-administrator/find-your-administrator.component';
import { CookiesSettingsComponent } from './components/cookies-settings/cookies-settings.component';
import { ContactAdminComponent } from './pages/contact-admin/contact-admin.component';
import { ManageOrganisationProfileAddContactToSiteComponent } from './pages/manage-organisation/manage-organisation-profile-add-contact-to-site/manage-organisation-profile-add-contact-to-site.component';
import { ConfirmMfaResetComponent } from './pages/user-profile-mfa/confirm-mfa-reset/confirm-mfa-reset.component';
import { SuccessUserMfaComponent } from './pages/user-profile-mfa/success-user-mfa/success-user-mfa.component';
import { AccessibilityStatementComponent } from './pages/accessibility-statement/accessibility-statement.component';
import { ManageOrganisationRemoveIdpConfirmComponent } from './pages/manage-organisation/manage-organisation-remove-idp-confirm/manage-organisation-remove-idp-confirm';
import { DelegatedUserListComponent } from './pages/manage-delegated/delegated-user-list/delegated-user-list.component';
import { FindDelegatedUserComponent } from './pages/manage-delegated/find-delegated-user/find-delegated-user.component';
import { DelegatedUserStatusComponent } from './pages/manage-delegated/delegated-user-status/delegated-user-status.component';
import { DelegatedAccessUserComponent } from './pages/manage-delegated/delegated-access-user/delegated-access-user.component';
import { DelegatedUserConfirmComponent } from './pages/manage-delegated/delegated-user-confirm/delegated-user-confirm.component';
import { DelegatedSuccessComponent } from './pages/manage-delegated/delegated-success/delegated-success.component';
import { DelegatedRemoveConfirmComponent } from './pages/manage-delegated/delegated-remove-confirm/delegated-remove-confirm.component';
import { DelegatedErrorComponent } from './pages/manage-delegated/delegated-error/delegated-error.component';
import { DelegatedUserActivationComponent } from './pages/manage-delegated/landing-pages/delegated-user-activation/delegated-user-activation.component';
import { DelegatedOrganisationComponent } from './pages/manage-delegated/user/delegated-organisation/delegated-organisation.component';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions.component';
import { ForgotPasswordErrorComponent } from './pages/forgot-password-error/forgot-password-error.component';
import { ViewPendingVerificationComponent } from './pages/manage-buyer-and-both-requests/view-pending-verification/view-pending-verification.component';
import { ViewVerifiedOrgComponent } from './pages/manage-buyer-and-both-requests/view-verified-org/view-verified-org.component';
import { UpdateOrgTypeComponent } from './pages/buyer/update-org-type/update-org-type.component';
import { AutoValidationBuyerSuccessComponent } from './pages/buyer/auto-validation-buyer-success/auto-validation-buyer-success.component';
import { ConfirmOrgTypeComponent } from './pages/buyer/confirm-org-type/confirm-org-type.component';
import { ConfirmDeclineComponent } from './pages/manage-buyer-and-both-requests/confirm-decline/confirm-decline.component';
import { BuyerBothRequestsComponent } from './pages/manage-buyer-and-both-requests/buyer-both-requests/buyer-both-requests.component';
import { ConfirmAcceptComponent } from './pages/manage-buyer-and-both-requests/confirm-accept/confirm-accept.component';
import { RemoveRightToBuyComponent } from './pages/manage-buyer-and-both-requests/remove-right-to-buy/remove-right-to-buy.component';
import { SuccessRightToBuyComponent } from './pages/manage-buyer-and-both-requests/success-right-to-buy/success-right-to-buy.component';
import { BuyerBothRequestsSuccessComponent } from './pages/manage-buyer-and-both-requests/buyer-both-requests-success/buyer-both-requests-success.component';
import { BuyerBothErrorComponent } from './pages/manage-buyer-and-both-requests/buyer-both-error/buyer-both-error.component';
import { ManageUserRoleComponent } from './pages/manage-role/manage-user-role/manage-user-role.component';
import { RoleRequestSuccessComponent } from './pages/manage-role/role-request-success/role-request-success.component';
import { RoleRequestFailedComponent } from './pages/manage-role/role-request-failed/role-request-failed.component';
import { UpdateOrgServiceComponent } from './pages/buyer/update-org-service/update-org-service.component';
import { ConfirmOrgServiceComponent } from './pages/buyer/confirm-org-service/confirm-org-service.component';
import { SuccessOrgServiceComponent } from './pages/buyer/success-org-service/success-org-service.component';
import { VerifyUserComponent } from './pages/manage-user/verify-user/verify-user.component';
import { VerifyUserStatusComponent } from './pages/manage-user/verify-user-status/verify-user-status.component';
import { DataMigrationUploadComponent } from './pages/data-migration/data-migration-upload/data-migration-upload.component';
import { DataMigrationStatusComponent } from './pages/data-migration/data-migration-status/data-migration-status.component';
import { DataMigrationErrorComponent } from './pages/data-migration/data-migration-error/data-migration-error.component';
import { DataMigrationSummaryComponent } from './pages/data-migration/data-migration-summary/data-migration-summary.component';
import { ManageOrganisationRegisterationCiiComponent } from './pages/manage-organisation/manage-organisation-registeration-cii/manage-organisation-registeration-cii.component';
import { UserProfileResolver } from './resolvers/user-profile.resolver';
import { ManageOrgRegErrorAddressDetailsComponent } from './pages/manage-organisation/manage-organisation-registration-error-empty-address-details/manage-organisation-registration-error-empty-address-details.component';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';
import { MaintenanceCheck } from './services/helper/maintenance-check';
import { MfaSelectionComponent } from './pages/two-mfa/mfa-selection/mfa-selection.component';
import { MfaInformationComponent } from './pages/two-mfa/mfa-authenticator/mfa-authenticator-information/mfa-authenticator-information.component';
import { MfaAuthenticatorSetupComponent } from './pages/two-mfa/mfa-authenticator/mfa-authenticator-setup/mfa-authenticator-setup.component';
import { MfaMessageStep1Component } from './pages/two-mfa/mfa-message/mfa-message-step-1/mfa-message-step-1.component';
import { MfaMessageStep2Component } from './pages/two-mfa/mfa-message/mfa-message-step-2/mfa-message-step-2.component';
import { NoMfaConfiramtionComponent } from './pages/two-mfa/no-mfa-confirmation/no-mfa-confirmation.component';
import { MfaOffSaveSuccessComponent } from './pages/two-mfa/deactivate-two-mfa-success/mfa-off-save-success.component';
import { MfaAuthenticationSetupSuccessComponent } from './pages/two-mfa/mfa-setup-success/mfa-authentication-setup-success/mfa-authentication-setup-sucess.component';
import { MfaNoAuthenticationSetupSuccessComponent } from './pages/two-mfa/mfa-setup-success/mfa-no-authentication-setup-success/mfa-no-authentication-setup-success.component';
import { ManageOrgRegMfaComponent } from './pages/two-mfa/manage-reg-organisation-mfa/manage-reg-organisation-mfa.component';
import { MfaGuard } from './services/auth/mfa.guard';
import { ManageOrgMfaUpdateSuccessComponent } from './pages/two-mfa/manage-org-mfa-update-success/manage-org-mfa-update-success.component';
import { DormancyMessageComponent } from './pages/dormancy-message/dormancy-message.component';
import { ManageUserDeactivateConfirmComponent } from './pages/manage-user/manage-user-deactivate-confirm/manage-user-deactivate-confirm.component';
import { ManageUserReactivateConfirmComponent } from './pages/manage-user/manage-user-reactivate-confirm/manage-user-reactivate-confirm.component';
import { ForceLogoutComponent } from './pages/force-logout/force-logout.component';
import { DormancyGuard } from './services/auth/dormancyGuard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'renewtkn',     
    pathMatch: 'full',  component: 
    AuthErrorComponent },
  {
    path: 'mockservicelogin',
    data: { title: 'Login' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: LoginComponent,
  },
  {
    path: 'home',
    data: { title: 'Dashboard' },
    canActivate: [MaintenanceCheck, AuthGuard,DormancyGuard],
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'error',
    data: { title: 'Error' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ErrorComponent,
  },
  {
    path: 'contactus',
    data: { title: 'Contact Us' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ContactUsComponent,
  },
  {
    path: 'profile',
    data: { title: 'My Profile', roles: ['MANAGE_MY_ACCOUNT'] },
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    pathMatch: 'full',
    resolve: { isAdmin: UserProfileResolver },
    component: UserProfileComponent,
  },
  {
    path: 'confirm-user-mfa-reset',
    data: { title: 'Additional security Reset', roles: ['MANAGE_MY_ACCOUNT'] },
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    pathMatch: 'full',
    component: ConfirmMfaResetComponent,
  },
  {
    path: 'user-mfa-reset-success',
    data: { title: 'Additional security Reset', roles: ['MANAGE_MY_ACCOUNT'] },
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    pathMatch: 'full',
    component: SuccessUserMfaComponent,
  },
  {
    path: 'contact-admin',
    data: { title: 'Contact my administrator', roles: ['MANAGE_MY_ACCOUNT'] },
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    pathMatch: 'full',
    component: ContactAdminComponent,
  },
  {
    path: 'operation-success/:operation',
    data: { title: 'Success' },
    canActivate: [MaintenanceCheck, AuthGuard],
    pathMatch: 'full',
    component: OperationSuccessComponent,
  },
  {
    path: 'change-password-success/:operation',
    data: { title: 'Success - Change Password' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: OperationSuccessComponent,
  },
  {
    path: 'manage-org/register/find-your-administrator',
    data: { title: 'How to find your administrator' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: FindyouradministratorComponent,
  },
  {
    path: 'change-password-failed/:operation',
    data: { title: 'Error - Change Password' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: OperationFailedComponent,
  },
  {
    path: 'user-contact-edit',
    data: { title: 'Add/Edit - User Contact' },
    canActivate: [MaintenanceCheck, AuthGuard,DormancyGuard],
    pathMatch: 'full',
    component: UserContactEditComponent,
  },
  {
    path: 'user-contact-delete',
    data: { title: 'Delete - User Contact' },
    canActivate: [MaintenanceCheck, AuthGuard,DormancyGuard],
    pathMatch: 'full',
    component: UserContactDeleteConfirmComponent,
  },
  {
    path: 'forgot-password',
    data: { title: 'Reset your password' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ForgotPasswordComponent,
  },
  {
    path: 'forgot-password-success',
    data: { title: 'Success - Reset your password' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ForgotPasswordSuccessComponent,
  },
  {
    path: 'forgot-password-error',
    data: { title: 'Error - Reset your password' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ForgotPasswordErrorComponent,
  },
  {
    path: 'resend-link-success',
    data: { title: 'Success - Resend Link' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ResendLinkSuccessComponent,
  },
  {
    path: 'change-password',
    data: { title: 'Change Password' },
    canActivate: [MaintenanceCheck, AuthGuard],
    pathMatch: 'full',
    component: ChangePasswordComponent,
  },
  {
    path: 'token',
    data: { title: 'Token' },
    canActivate: [MaintenanceCheck, AuthGuard],
    pathMatch: 'full',
    component: TokenComponent,
  },
  {
    path: 'authsuccess',
    data: { title: 'Auth Success' },
    canActivate: [MaintenanceCheck],
    component: AuthSuccessComponent,
  },
  {
    path: 'registration/success',
    data: { title: 'Success' },
    canActivate: [MaintenanceCheck],
    component: RegistrationSuccessComponent,
  },
  //Search paths//
  {
    path: 'manage-org/register/initial-search',
    data: { title: 'Search Organisation - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegSearchComponent,
  },
  {
    path: 'manage-org/register/initial-search-status/new',
    data: { title: 'Search Organisation - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegSearchStatusNewComponent,
  },
  {
    path: 'manage-org/register/initial-search-status/exists',
    data: { title: 'Search Organisation - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegSearchStatusExistsComponent,
  },
  {
    path: 'manage-org/register/initial-search-status/duplicate',
    data: { title: 'Search Organisation - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegSearchStatusDuplicateComponent,
  },
  {
    path: 'manage-org/register/newreg',
    data: { title: 'Admin Details - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegNotRegisteredComponent,
  },
  {
    path: 'manage-org/register/cii-search-result',
    data: { title: 'Organization Details - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegCIIOrgDisplayComponent,
  },
  {
    path: 'manage-org/register/notify-join-org',
    data: { title: 'Notify Organisation Administrators - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegNotifyAdminComponent,
  },
  {
    path: 'manage-org/register',
    data: { title: 'Register' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegStep1Component,
  },
  {
    path: 'manage-org/register/type',
    data: { title: 'Organisation type' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegRightToBuyComponent,
  },
  {
    path: 'manage-org/register/buyer-type',
    data: { title: 'Buyer Type - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegBuyerTypeComponent,
  },
  {
    path: 'manage-org/register/start',
    data: { title: 'Start - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegStep1BComponent,
  },
  {
    path: 'manage-org/register/search',
    data: { title: 'Enter Details - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegStep2Component,
  },
  {
    path: 'manage-org/register/search/:scheme',
    data: { title: 'Confirm Organisation Details - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegStep3Component,
  },
  {
    path: 'manage-org/register/search/:scheme/:id/additional-identifiers',
    data: { title: 'Confirm Additional Identifiers - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegAdditionalIdentifiersComponent,
  },
  {
    path: 'manage-org/register/user',
    data: { title: 'Admin Details - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegAddUserComponent,
  },
  {
    path: 'manage-org/register/confirm',
    data: { title: 'Confirm - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegConfirmComponent,
  },
  {
    path: 'manage-org/register/success',
    data: { title: 'Success - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegSuccessComponent,
  },
  {
    path: 'manage-org/error/:reason',
    data: { title: 'Error' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrganisationErrorComponent,
  },
  {
    path: 'manage-org/register/error',
    data: { title: 'Error - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegErrorComponent,
  },
  {
    path: 'manage-org/register/error/generic',
    data: { title: 'Error - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegErrorGenericComponent,
  },
  {
    path: 'manage-org/register/error/address-details',
    data: { title: 'Error - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component:ManageOrgRegErrorAddressDetailsComponent,
  },
  {
    path: 'manage-org/register/error/username',
    data: { title: 'Error - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegErrorUsernameExistsComponent,
  },
  {
    path: 'manage-org/register/error/notfound',
    data: { title: 'Error - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegErrorNotFoundComponent,
  },
  {
    path: 'manage-org/register/error/cii',
    data: { title: 'Error - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrganisationRegisterationCiiComponent,
  },
  {
    path: 'manage-org/register/error/reg-id-exists',
    data: { title: 'Error - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegFailureComponent,
  },
  {
    path: 'manage-org/register/error/wrong-details',
    data: { title: 'Wrong Company Details - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegDetailsWrongComponent,
  },
  {
    path: 'manage-org/register/error/not-my-details',
    data: { title: 'Not My Organisation - Registration' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: ManageOrgRegOrgNotFoundComponent,
  },
  {
    path: 'manage-org/profile',
    data: { title: 'Manage your organisation', roles: ['MANAGE_ORGS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageOrganisationProfileComponent,
  },
  {
    path: 'manage-org/idp-confirm',
    data: { title: 'removing a sign in provider', roles: ['MANAGE_ORGS'] },    
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageOrganisationRemoveIdpConfirmComponent,
  },
  {
    path: 'manage-org/profile/contact-edit',
    data: { title: 'Add/Edit - Organisation Contact', roles: ['MANAGE_ORGS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageOrganisationContactEditComponent,
  },
  {
    path: 'manage-org/profile/contact-delete',
    data: { title: 'Delete Organisation Contact', roles: ['MANAGE_ORGS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageOrganisationContactDeleteComponent,
  },
  {
    path: 'manage-org/profile/site/contact-edit',
    data: { title: 'Add/Edit - Site Contact', roles: ['MANAGE_ORGS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageOrganisationContactEditComponent,
  },
  {
    path: 'manage-org/profile/site/contact-delete',
    data: { title: 'Delete - Site Contact', roles: ['MANAGE_ORGS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageOrganisationContactDeleteComponent,
  },
  {
    path: 'manage-org/profile/contact-operation-success/:operation',
    data: { title: 'Success', roles: ['MANAGE_ORGS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageOrganisationContactOperationSuccessComponent,
  },
  {
    path: 'cookies',
    data: { title: 'Cookies Settings' },    
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: CookiesSettingsComponent,
  },
  {
    path: 'manage-org/profile/:organisationId/registry/error/:reason',
    data: { title: 'Error - Add Registry', roles: ['MANAGE_ORGS'] },
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageOrganisationRegistryErrorComponent,
  },
  {
    path: 'manage-org/profile/success',
    data: {
      title: 'Success - Edit - Manage Organisation',
      roles: ['MANAGE_ORGS'],
    },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageOrganisationProfileSuccessComponent,
  },
  {
    path: 'manage-org/profile/registry/search',
    data: { title: 'Registry Search', roles: ['MANAGE_ORGS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageOrganisationRegistrySearchComponent,
  },
  {
    path: 'manage-org/profile/:organisationId/registry/search',
    data: {
      title: 'Add Registry - Manage Organisation',
      roles: ['MANAGE_ORGS'],
    },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageOrganisationRegistrySearchComponent,
  },
  {
    path: 'manage-org/profile/:organisationId/registry/search/:scheme/:id/additional-identifiers',
    data: {
      title:
        'Confirm Additional Identifiers - Add Registry - Manage Organisation',
      roles: ['MANAGE_ORGS'],
    },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageOrganisationRegistryConfirmAdditionalDetailsComponent,
  },
  {
    path: 'manage-org/profile/:organisationId/registry/search_confirm/:scheme',
    data: {
      title: 'Confirm Registry - Add Registry - Manage Organisation',
      roles: ['MANAGE_ORGS'],
    },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageOrganisationRegistryConfirmComponent,
  },
  {
    path: 'manage-org/profile/:organisationId/registry/confirmation/:scheme/:id',
    data: {
      title: 'Success - Add Registry - Manage Organisation',
      roles: ['MANAGE_ORGS'],
    },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageOrganisationRegistryAddConfirmationComponent,
  },
  {
    path: 'manage-org/profile/:organisationId/registry/search/wrong-details',
    data: {
      title: 'Wrong Company Details - Add Registry - Manage Organisation',
      roles: ['MANAGE_ORGS'],
    },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageOrganisationRegistryDetailsWrongComponent,
  },
  {
    path: 'manage-org/profile/:organisationId/registry/search/not-my-org',
    data: {
      title: 'Not My Organisation - Add Registry - Manage Organisation',
      roles: ['MANAGE_ORGS'],
    },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageOrganisationRegistryOrgNotFoundComponent,
  },
  {
    path: 'manage-org/profile/:organisationId/registry/delete/:scheme/:id',
    data: {
      title: 'Remove Registry - Manage Organisation',
      roles: ['MANAGE_ORGS'],
    },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageOrganisationRegistryDeleteComponent,
  },
  {
    path: 'manage-org/profile/:organisationId/registry/delete/confirmation/:scheme/:id',
    data: {
      title: 'Success - Remove Registry - Manage Organisation',
      roles: ['MANAGE_ORGS'],
    },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageOrganisationRegistryDeleteConfirmationComponent,
  },
  {
    path: 'manage-users',
    data: { title: 'Manage User Accounts', roles: ['MANAGE_USERS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageUserProfilesComponent,
  },
  {
    path: 'manage-users/add-user-selection',
    data: { title: 'Select - Manage Users', roles: ['MANAGE_USERS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageUserAddSelectionComponent,
  },
  {
    path: 'manage-users/bulk-users',
    data: { title: 'Bulk Upload - Manage Users', roles: ['MANAGE_USERS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageUserBulkUploadComponent,
  },
  {
    path: 'manage-users/bulk-users/status/:id',
    data: { title: 'Bulk Upload - Manage Users', roles: ['MANAGE_USERS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageUserBulkUploadStatusComponent,
  },
  {
    path: 'manage-users/bulk-users/migration-status/:id',
    data: { title: 'Bulk Upload - Manage Users', roles: ['MANAGE_USERS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageUserBulkUploadMigrationStatusComponent,
  },
  {
    path: 'manage-users/add-user/details',
    data: { title: 'Add/Edit - Manage Users', roles: ['MANAGE_USERS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageUserAddSingleUserDetailComponent,
  },
  {
    path: 'manage-users/verify-user',
    data: { title: 'Manage Users'},
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard],
    component: VerifyUserComponent,
  },
  {
    path: 'manage-users/verify-user/status',
    data: { roles: ['MANAGE_USERS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard],
    component: VerifyUserStatusComponent,
  },
  {
    path: 'manage-users/confirm-reset-password',
    data: { title: 'Reset Password - Manage Users', roles: ['MANAGE_USERS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageUserConfirmResetPasswordComponent,
  },
  {
    path: 'manage-users/confirm-user-delete',
    data: { title: 'Delete - Manage Users', roles: ['MANAGE_USERS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageUserDeleteConfirmComponent,
  },
  {
    path: 'manage-users/role',
    data: { title: 'Fleet Portal access verification'},
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard],
    component: ManageUserRoleComponent,
  },
  {
    path: 'manage-users/role/success',
    data: { title: 'Fleet Portal access verification'},
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard],
    component: RoleRequestSuccessComponent,
  },
  {
    path: 'manage-users/role/failed',
    data: { title: 'Fleet Portal access verification'},
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard],
    component: RoleRequestFailedComponent,
  },
  {
    path: 'manage-org/profile/site/edit',
    data: { title: 'Add/Edit - Site', roles: ['MANAGE_ORGS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageOrganisationSiteEditComponent,
  },
  {
    path: 'manage-org/profile/site/add-contact-to-site',
    data: { title: 'Add/Edit - Site', roles: ['MANAGE_ORGS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageOrganisationProfileAddContactToSiteComponent,
  },
  {
    path: 'manage-org/profile/site/delete',
    data: { title: 'Delete - Site', roles: ['MANAGE_ORGS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageOrganisationSiteDeleteComponent,
  },
  {
    path: 'nominate',
    data: { title: 'Nominate' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: NominateComponent,
  },
  {
    path: 'nominate/success',
    data: { title: 'Success - Nominate' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: NominateSuccessComponent,
  },
  {
    path: 'buyer-supplier/search',
    data: { title: 'Manage Buyers-Suppliers', roles: ['MANAGE_SUBSCRIPTIONS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: BuyerSearchComponent,
  },
  {
    path: 'buyer/details/:id',
    data: {
      title: 'Confirm Organisation - Manage Buyers',
      roles: ['MANAGE_SUBSCRIPTIONS'],
    },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: BuyerDetailsComponent,
  },
  // {
  //   path: 'buyer/confirm/:id',
  //   data: { title: 'Review - Manage Buyers', roles: ['MANAGE_SUBSCRIPTIONS'] },
  //   pathMatch: 'full',
  //   canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
  //   component: BuyerConfirmComponent,
  // },
  {
    path: 'update-org-type/confirm',
    data: { title: 'Review - Manage Buyers', roles: ['MANAGE_SUBSCRIPTIONS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: UpdateOrgTypeComponent,
  },
  {
    path: 'update-org-services/confirm',
    data: { title: 'Review - Manage Buyers', roles: ['MANAGE_SUBSCRIPTIONS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: UpdateOrgServiceComponent,
  },
  {
    path: 'update-org-type/buyer-success/:id',
    data: { title: 'Review - Manage Buyers', roles: ['MANAGE_SUBSCRIPTIONS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: AutoValidationBuyerSuccessComponent,
  },
  {
    path: 'org-service/success/:id',
    data: { title: 'Success - Manage Buyers', roles: ['MANAGE_SUBSCRIPTIONS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: SuccessOrgServiceComponent,
  },
  {
    path: 'buyer/confirm-changes/:id',
    data: {
      title: 'Confirm Changes - Manage Buyers',
      roles: ['MANAGE_SUBSCRIPTIONS'],
    },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: BuyerConfirmChangesComponent,
  },
  {
    path: 'update-org-type/confirm-changes',
    data: {
      title: 'Confirm Changes - Manage Buyers',
      roles: ['MANAGE_SUBSCRIPTIONS'],
    },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ConfirmOrgTypeComponent,
  },
  {
    path: 'update-org-services/confirm-changes',
    data: {
      title: 'Confirm organisation changes - Manage Buyers',
      roles: ['MANAGE_SUBSCRIPTIONS'],
    },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ConfirmOrgServiceComponent,
  },
  {
    path: 'buyer/error',
    data: { title: 'Error - Manage Buyers', roles: ['MANAGE_SUBSCRIPTIONS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: BuyerErrorComponent,
  },
  {
    path: 'buyer/success',
    data: { title: 'Success - Manage Buyers', roles: ['MANAGE_SUBSCRIPTIONS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: BuyerSuccessComponent,
  },
  {
    path: 'org-support/search',
    data: { title: 'Organisation Support', roles: ['ORG_USER_SUPPORT'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: OrgSupportSearchComponent,
  },
  {
    path: 'org-support/details',
    data: {
      title: 'Update User - Organisation Support',
      roles: ['ORG_USER_SUPPORT'],
    },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: OrgSupportDetailsComponent,
  },
  {
    path: 'org-support/confirm',
    data: {
      title: 'Confirm - Update User - Organisation Support',
      roles: ['ORG_USER_SUPPORT'],
    },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: OrgSupportConfirmComponent,
  },
  {
    path: 'org-support/success',
    data: {
      title: 'Success - Update User - Organisation Support',
      roles: ['ORG_USER_SUPPORT'],
    },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: OrgSupportSuccessComponent,
  },
  {
    path: 'org-support/error',
    data: {
      title: 'Error - Update User - Organisation Support',
      roles: ['ORG_USER_SUPPORT'],
    },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: OrgSupportErrorComponent,
  },
  {
    path: 'manage-groups',
    data: { title: 'Manage Groups', roles: ['MANAGE_GROUPS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageGroupListComponent,
  },
  {
    path: 'manage-groups/view',
    data: { title: 'Manage Groups', roles: ['MANAGE_USERS', 'MANAGE_GROUPS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageGroupViewComponent,
  },
  {
    path: 'manage-groups/edit-name',
    data: { title: 'Add/Edit Name - Manage Groups', roles: ['MANAGE_GROUPS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageGroupEditNameComponent,
  },
  {
    path: 'manage-groups/edit-users',
    data: { title: 'Add/Edit Users - Manage Groups', roles: ['MANAGE_GROUPS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageGroupEditUsersComponent,
  },
  {
    path: 'manage-groups/edit-users-confirm',
    data: {
      title: 'Confirm - Add/Edit Users - Manage Groups',
      roles: ['MANAGE_GROUPS'],
    },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageGroupEditUsersConfirmComponent,
  },
  {
    path: 'manage-groups/edit-roles',
    data: { title: 'Add/Edit Roles - Manage Groups', roles: ['MANAGE_GROUPS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageGroupEditRolesComponent,
  },
  {
    path: 'manage-groups/edit-roles-confirm',
    data: {
      title: 'Confirm - Add/Edit Roles - Manage Groups',
      roles: ['MANAGE_GROUPS'],
    },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageGroupEditRolesConfirmComponent,
  },
  {
    path: 'manage-groups/operation-success/:operation',
    data: { title: 'Success', roles: ['MANAGE_GROUPS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageGroupOperationSuccessComponent,
  },
  {
    path: 'manage-groups/delete-group-confirm',
    data: { title: 'Delete - Manage Groups', roles: ['MANAGE_GROUPS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageGroupDeleteConfirmComponent,
  },
  {
    path: 'manage-groups/error',
    data: { title: 'Error - Edit - Manage Groups', roles: ['MANAGE_GROUPS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ManageGroupErrorComponent,
  },
  {
    path: 'contact-assign/select',
    data: {
      title: 'Select Contact Type - Assign Contacts',
      roles: ['MANAGE_ORGS'],
    },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ContactAssignSelectionComponent,
  },
  {
    path: 'contact-assign/user-search',
    data: {
      title: "Assign a user's contacts to your organisation account",
      roles: ['MANAGE_ORGS'],
    },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ContactAssignUserSearchComponent,
  },
  {
    path: 'contact-assign/site-search',
    data: {
      title: "Assign a site's contacts to your organisation account",
      roles: ['MANAGE_ORGS'],
    },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ContactAssignSiteSearchComponent,
  },
  {
    path: 'contact-assign',
    data: { title: 'Assign Contacts', roles: ['MANAGE_ORGS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ContactAssignComponent,
  },
  {
    path: 'contact-assign/confirm',
    data: { title: 'Confirm - Assign Contacts', roles: ['MANAGE_ORGS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ContactAssignConfirmComponent,
  },
  {
    path: 'contact-assign/success',
    data: { title: 'Success - Assign Contacts', roles: ['MANAGE_ORGS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ContactAssignSuccessComponent,
  },
  {
    path: 'contact-unassign/confirm',
    data: { title: 'Confirm - Unassign Contact', roles: ['MANAGE_ORGS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ContactUnassignConfirmComponent,
  },
  {
    path: 'contact-unassign/success',
    data: { title: 'Success - Unassign Contact', roles: ['MANAGE_ORGS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ContactUnassignSuccessComponent,
  },
  {
    path: 'contact-assign/error',
    data: { title: 'Error - Assign Contacts', roles: ['MANAGE_ORGS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ContactAssignErrorComponent,
  },
  {
    path: 'help-support',
    data: { title: 'Help and support' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: HelpAndSupportComponent,
  },
  {
    path: 'accessibility-statement',
    data: { title: 'Accessibility statement' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: AccessibilityStatementComponent,
  },
  {
    path: 'mfaresetnotification',
    data: { title: 'Email - Additional security Reset' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: SendMFAResetNotificationComponent,
  },
  {
    path: 'mfaresetnotification/success',
    data: { title: 'Success - Email - Additional security Reset' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: SendMFAResetNotificationSuccessComponent,
  },
  {
    path: 'mfareset',
    data: { title: 'Additional security Reset' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: MFAResetComponent,
  },
  {
    path: 'delegated-access',
    data: { title: 'Delegated access', roles: ['DELEGATED_ACCESS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: DelegatedUserListComponent,
  },
  {
    path: 'find-delegated-user',
    data: { title: 'Find a user' , roles: ['DELEGATED_ACCESS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: FindDelegatedUserComponent,
  },
  {
    path: 'delegated-user-status',
    data: { title: 'delegated-user-status', roles: ['DELEGATED_ACCESS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: DelegatedUserStatusComponent,
  },
  {
    path: 'delegate-access-user',
    data: { title: 'Delegate access to a user', roles: ['DELEGATED_ACCESS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: DelegatedAccessUserComponent,
  },
  {
    path: 'delegate-user-confirm',
    data: { title: 'delegate-user-confirm', roles: ['DELEGATED_ACCESS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: DelegatedUserConfirmComponent,
  },
  {
    path: 'delegated-success',
    data: { title: 'Delegated user successfully updated', roles: ['DELEGATED_ACCESS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: DelegatedSuccessComponent,
  },
  {
    path: 'delegated-remove-confirm',
    data: { title: 'delegated-remove-confirm', roles: ['DELEGATED_ACCESS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: DelegatedRemoveConfirmComponent,
  },
  {
    path: 'delegated-user-activation',
    data: { title: 'Delegated user activation' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: DelegatedUserActivationComponent,
  },
  {
    path: 'delegated-organisation',
    data: { title: 'Manage your delegated access'},
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard,DormancyGuard],
    component: DelegatedOrganisationComponent,
  },
  {
    path: 'delegated-error',
    data: { title: 'Delegate-error' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: DelegatedErrorComponent,
  },
  {
    path: 'manage-buyer-both',
    data: { title: 'Manage Buyer status Requests',roles: ['MANAGE_SUBSCRIPTIONS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: BuyerBothRequestsComponent,
  },
  {
    path: 'confirm-decline',
    data: { title: 'Decline right to buy status',
    roles: ['MANAGE_SUBSCRIPTIONS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ConfirmDeclineComponent,
    
  },
  {
    path: 'confirm-accept',
    data: { title: 'Approve right to buy status',roles: ['MANAGE_SUBSCRIPTIONS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ConfirmAcceptComponent,
  },
  {
    path: 'pending-verification',
    data: { title: 'Manage Buyer status requests - View request',roles: ['MANAGE_SUBSCRIPTIONS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ViewPendingVerificationComponent,
  },
  {
    path: 'verified-organisations',
    data: { title: 'Manage Buyer status requests - View Buyer status for the organisation' ,roles: ['MANAGE_SUBSCRIPTIONS']},
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: ViewVerifiedOrgComponent,
  },
  {
    path: 'remove-right-to-buy',
    data: { title: 'Remove right to buy status',roles: ['MANAGE_SUBSCRIPTIONS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: RemoveRightToBuyComponent,
  },
  {
    path: 'remove-right-to-buy-success',
    data: { title: 'Remove right to buy status – success',roles: ['MANAGE_SUBSCRIPTIONS'] },
    pathMatch: 'full',
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: SuccessRightToBuyComponent,
  },
  {
    path: 'decline-success',
    pathMatch: 'full',
    data: { roles: ['MANAGE_SUBSCRIPTIONS'] },
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: BuyerBothRequestsSuccessComponent,
  },
  {
    path: 'buyer-and-both-success',
    pathMatch: 'full',
    data: { roles: ['MANAGE_SUBSCRIPTIONS'] },
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: BuyerBothRequestsSuccessComponent,
  },
  {
    path: 'buyer-and-both-fail',
    pathMatch: 'full',
    data: { roles: ['MANAGE_SUBSCRIPTIONS'] },
    canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
    component: BuyerBothErrorComponent,
  },
  {
    path: 'data-migration/upload',
    pathMatch: 'full',
    data: { title: 'Data migration',roles: ['MANAGE_SUBSCRIPTIONS'] },
    canActivate: [MaintenanceCheck, AuthGuard,DormancyGuard],
    component: DataMigrationUploadComponent,
  },
  {
    path: 'data-migration/status',
    pathMatch: 'full',
    data: { title: 'File validation',roles: ['MANAGE_SUBSCRIPTIONS'] },
    canActivate: [MaintenanceCheck, AuthGuard,DormancyGuard],
    component: DataMigrationStatusComponent,
  },
  {
    path: 'data-migration/summary',
    pathMatch: 'full',
    data: { title: 'File validation',roles: ['MANAGE_SUBSCRIPTIONS'] },
    canActivate: [MaintenanceCheck, AuthGuard,DormancyGuard],
    component: DataMigrationSummaryComponent,
  },
  {
    path: 'data-migration/error',
    pathMatch: 'full',
    data: { title: 'Error',roles: ['MANAGE_SUBSCRIPTIONS'] },
    canActivate: [MaintenanceCheck, AuthGuard,DormancyGuard],
    component: DataMigrationErrorComponent,
  },
  {
    path: 'terms-of-use',
    data: { title: 'Terms of Use' },
    canActivate: [MaintenanceCheck],
    pathMatch: 'full',
    component: TermsConditionsComponent,
  },
  {
    path: 'maintenance',
    data: { title: 'Maintenance' },
    pathMatch: 'full',
    component: MaintenanceComponent,
  },
  {
    path: 'mfa-selection',
    data: { title : 'MFA Selection'},
    pathMatch: 'full',
     canActivate: [MfaGuard,DormancyGuard],
    component: MfaSelectionComponent, 
  },
 {
   path : 'mfa-authenticator-information',
   data : { title : 'Download an app'},
   pathMatch : 'full',
   canActivate: [MfaGuard,DormancyGuard],
   component :MfaInformationComponent
 },
 {
  path : 'mfa-authenticator-setup',
  data : {title :'Set up an app'},
  pathMatch : 'full',
  canActivate: [MfaGuard,DormancyGuard],
  component : MfaAuthenticatorSetupComponent
 },
 {
  path : 'mfa-message-step-1',
  data : {title : 'Enter your mobile number'},
  pathMatch : 'full',
  canActivate: [MfaGuard,DormancyGuard],
  component : MfaMessageStep1Component
 },

 {
  path : 'mfa-message-step-2',
  data : {title : 'Check your phone'},
  pathMatch : 'full',
  canActivate: [MfaGuard,DormancyGuard],
  component : MfaMessageStep2Component
 },
 {
  path : 'no-mfa-confirmation',
  data : {title : 'Are you sure'},
  pathMatch : 'full',
  canActivate: [MfaGuard,DormancyGuard],
  component : NoMfaConfiramtionComponent
 },
 {
  path : 'mfa-off-save-success',
  data : {title : 'Changes saved'},
  pathMatch : 'full',
  canActivate: [MfaGuard,DormancyGuard],
  component : MfaOffSaveSuccessComponent
 },
 {
  path: 'mfa-authentication-setup-sucess',
  data :{title : 'Authentication save success'},
  pathMatch : 'full',
  canActivate: [MfaGuard,DormancyGuard],
  component : MfaAuthenticationSetupSuccessComponent
 },
 {
  path :'mfa-no-authentication-setup-success',
  data :{title : 'No authentication save success'},
  pathMatch : 'full',
  canActivate: [MfaGuard,DormancyGuard],
  component : MfaNoAuthenticationSetupSuccessComponent
 },
 {
  path :'manage-reg-organisation-mfa',
  data: { title: '2FA selection - Registration' },
  pathMatch : 'full',
  component : ManageOrgRegMfaComponent
 },
 {
  path :'manage-org-mfa-update-success',
  data: { title: 'Organisation Mfa Update' },
  pathMatch : 'full',
  canActivate: [AuthGuard],
  component : ManageOrgMfaUpdateSuccessComponent
 },
 {
  path :'dormancy-message',
  data: { title: 'Dormant User Message' },
  pathMatch : 'full',
  component : DormancyMessageComponent
 },
 {
  path: 'manage-users/confirm-user-deactivate',
  data: { title: 'Deactivate - Manage Users', roles: ['MANAGE_USERS'] },
  pathMatch: 'full',
  canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
  component: ManageUserDeactivateConfirmComponent,
},
{
  path: 'manage-users/confirm-user-reactivate',
  data: { title: 'Reactivate - Manage Users', roles: ['MANAGE_USERS'] },
  pathMatch: 'full',
  canActivate: [MaintenanceCheck, AuthGuard, RoleGuard,DormancyGuard],
  component: ManageUserReactivateConfirmComponent,
}, 
 {
  path :'force-logout',
  pathMatch : 'full',
  component : ForceLogoutComponent
 }, 
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

export const routingConfiguration: ExtraOptions = {
  paramsInheritanceStrategy: 'always',
  scrollPositionRestoration: 'enabled',
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routingConfiguration)],
  exports: [RouterModule],
})
export class AppRoutingModule {}