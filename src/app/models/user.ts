import { UserTitleEnum } from "../constants/enum";
import { PaginationInfo } from "./paginationInfo";

export interface User {
    id: number,
    userName: string;
    userGroups: UserGroup[]
    organisationId: string;
}

export interface UserGroup {
    groupId: number;
    group: string;
    accessRole: string;
    accessRoleName: string;
    serviceClientId: string;
}

export interface UserDetail {
    userName: string;
    organisationId: string;
    title: string;
    firstName: string;
    lastName: string;
    mfaEnabled: boolean;
    isAdminUser: boolean;
    mfaOpted: boolean;
    isDormant : boolean;
}

export interface UserRequestDetail {
    serviceRoleGroupIds?: number[] | undefined;
    id: number,
    groupIds?: number[];
    roleIds?: number[];
    identityProviderIds?: number[];
}

export interface UserResponseDetail {
    id: number,
    userGroups?: UserGroup[];
    canChangePassword: boolean;
    rolePermissionInfo?: RolePermissionInfo[];
    identityProviders?: UserIdentityProviderInfo[]
}


export interface UserSericeResponseDetail {
    id: number,
    userGroups?: UserGroup[];
    canChangePassword: boolean;
    rolePermissionInfo?: ServicePermissionInfo[];
    identityProviders?: UserIdentityProviderInfo[]
}


export interface UserIdentityProviderInfo {
    identityProviderId?: number;
    identityProvider?: string;
    identityProviderDisplayName?: string;
}

export interface RolePermissionInfo {
    roleName: string;
    roleKey: string;
    roleId: number,
    serviceClientId: string;
    serviceClientName: string;
}

export interface ServicePermissionInfo {
    name: string;
    key: string;
    id: number,
    serviceClientId?: string;
    serviceClientName?: string;
}

export interface UserProfileRequestInfo extends UserDetail {
    detail: UserRequestDetail
}

export interface UserProfileResponseInfo extends UserDetail {
    detail: UserResponseDetail
}

export interface UserProfileServiceResponseInfo extends UserDetail {
    detail: UserSericeResponseDetail
}

export interface UserListInfo {
    name: string;
    userName: string;
    isAdmin: boolean;
    isDormant :boolean;
    routeLink?: string,
    routeData?: any
}

export interface AdminUserListInfo extends UserListInfo {
    role: string;
    email: string;
}

export interface UserListResponse extends PaginationInfo {
    organisationId: string;
    userList: UserListInfo[];
}

export interface UserListResponseWithLink extends UserListResponse{
    routeLink: string,
    routeData: any
}

export interface AdminUserListResponse extends PaginationInfo {
    organisationId: string;
    userList: AdminUserListInfo[];
}

export interface UserEditResponseInfo {
    userId: string;
    isRegisteredInIdam: boolean;
}

export interface CheckBoxUserListGridSource extends UserListInfo {
    isChecked?: boolean;
    isAdmin: boolean;
    isDisable:boolean;
    isDormant: boolean;
}

export interface OrganisationUserDto {
    id: number;
    userName: string;
    name: string;
    organisationId: number;
    organisationLegalName: string;
}


export interface OrgUserListResponse extends PaginationInfo {
    orgUserList: OrganisationUserDto[];
}

export interface PendingApproveRole {
    userName: string;
    detail: PendingApproveRoleDetail
}

export interface PendingApproveRoleDetail {
    roleIds: []
}

export interface acceptRejectRequestDetail {
    pendingRoleIds: number[];
    status: number
}
export interface userGroupTableDetail {
    isAdmin: boolean
    headerTextKey: string
    headerText: string,
    accessTable: string
    groupShow: boolean
    noRoleText?: any
    noRoleMessage?: string | any
    noDataGroupsMemberMessage?: string | any
    noDatanoneGroupsMemberMessage?: string | any
    data: any[]
}

export interface userTypeDetails {
    title:string
    description:string
    data:any []
    isGrayOut:any
    selectedValue ?:string
}