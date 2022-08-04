export interface Group {
    groupId: number;
    mfaEnabled:boolean;
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

export interface Role {
    roleId: number;
    roleKey:string;
    roleName: string;
    orgTypeEligibility?: number;
    subscriptionTypeEligibility?: number;
    tradeEligibility?: number;
    enabled?: boolean;
    serviceName?:string | null;
}

export interface CheckBoxRoleListGridSource extends Role{
    isChecked?: boolean
}

export interface OrganisationGroupResponseInfo extends Group {
    roles: GroupRole[],
    users: GroupUser[]
}

export interface GroupRole{
    id: number;
    name: string;
}

export interface GroupUser{
    userId: string;
    name: string;
}