export interface Group {
    groupId: number;
    mfaEnabled: boolean;
    groupName: string;
    createdDate?: string;
}

export interface GroupList {
    organisationId: string;
    groupList: Group[]
}

export interface OrganisationGroupNameInfo {
    groupName?: string;
}

export interface OrganisationGroupRequestInfo extends OrganisationGroupNameInfo {
    roleInfo?: OrganisationGroupRolePatchInfo,
    userInfo?: OrganisationGroupUserPatchInfo
}

export interface OrganisationGroupRolePatchInfo {
    addedRoleIds: number[],
    removedRoleIds: number[]
}

export interface OrganisationGroupUserPatchInfo {
    addedUserIds: string[],
    removedUserIds: string[]
}

export interface RoleDetail {
    orgTypeEligibility?: number;
    description?: string;
    subscriptionTypeEligibility?: number;
    tradeEligibility?: number;
    enabled?: boolean;
    serviceName?: string | null;
    isDeleted?: boolean;
}

export interface Role extends RoleDetail {
    pendingStatus?: boolean;
    roleId: number;
    roleKey: string;
    roleName: string;
}

export interface ServiceRoleGroup extends RoleDetail {
    id: number;
    key: string;
    name: string;
}

export interface CheckBoxRoleListGridSource extends Role {
    isChecked?: boolean
    isDisable?: any

}

export interface OrganisationGroupResponseInfo extends Group {
    roles: GroupRole[],
    users: GroupUser[]
}

export interface GroupRole {
    id: number;
    name: string;
}

export interface GroupUser {
    userId: string;
    name: string;
    isAdmin: boolean;
}